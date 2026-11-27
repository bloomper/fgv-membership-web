// Stands in for Keycloak (a minimal OpenID Connect provider) and for Medlemskap's API, so that the web is tested as a
// browser sees it without the rest of the stack. State is reset before each test, and the calls it receives can be read
// back with GET /__calls.
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { exportJWK, generateKeyPair, SignJWT } from "jose";

const PORT = Number(process.env.MOCK_PORT || 4000);
const ISSUER = `http://localhost:${PORT}/realms/e2e`;
const KID = "e2e-key";
const CLIENT_ID = "e2e";
const TOKEN_TTL = 3600;
const USER = {
  sub: "user-1",
  name: "Greta Test",
  email: "greta@example.org",
  email_verified: true,
  preferred_username: "greta",
};

const { privateKey, publicKey } = await generateKeyPair("RS256", { extractable: true });
const publicJwk = { ...(await exportJWK(publicKey)), kid: KID, alg: "RS256", use: "sig" };
const pendingCodes = new Map();

let roles;
let calls;
let state;

function reset() {
  roles = ["USER"];
  calls = [];
  state = {
    linked: true,
    memberships: [{ id: "m-2025", type: "FGV", year: 2025, lifetime: false, status: "PAID" }],
    fees: [
      {
        id: "fee-std",
        year: 2026,
        kind: "STANDARD",
        lifetime: false,
        nameSv: "Ordinarie",
        nameEn: "Standard",
        amount: 200,
        retired: false,
      },
      {
        id: "fee-fam",
        year: 2026,
        kind: "FAMILY",
        lifetime: false,
        nameSv: "Familj",
        nameEn: "Family",
        amount: 350,
        retired: false,
      },
      {
        id: "fee-sup",
        year: 2026,
        kind: "SUPPORT",
        lifetime: false,
        nameSv: "Stöd",
        nameEn: "Support",
        amount: 100,
        retired: false,
      },
      {
        id: "fee-life",
        year: null,
        kind: "LIFETIME",
        lifetime: true,
        nameSv: "Livstid",
        nameEn: "Life",
        amount: 2000,
        retired: false,
      },
    ],
    requests: [],
    settings: {
      swishNumber: "123 456 78 90",
      bankgiro: "123-4567",
      bankAccount: "",
      payeeName: "FGV",
      reminderDays: 3,
      recipients: ["admin@example.org"],
    },
    saved: [],
  };
}

reset();

const payee = () => ({
  swishNumber: state.settings.swishNumber,
  bankgiro: state.settings.bankgiro,
  bankAccount: state.settings.bankAccount || null,
  name: "FGV",
});

function request(id) {
  const r = state.requests.find((candidate) => candidate.id === id);

  return (
    r && {
      ...r,
      payee: payee(),
      paid: r.status === "MATCHED" ? r.amount : 0,
      spexareName: "Greta Test",
      family: r.family ?? false,
      familyNote: null,
      familyIncomplete: false,
      swishLink:
        r.status === "OPEN" || r.status === "REPORTED"
          ? `swish://payment?data=${encodeURIComponent(r.reference)}`
          : null,
      qr: null,
      reportedAt: null,
      createdAt: "2026-11-26T10:00:00Z",
    }
  );
}

function handleGraphql(raw, res, authorization) {
  const { query, variables = {} } = JSON.parse(raw);

  calls.push({ query, variables, authorization });

  const data = {};

  if (query.includes("myMembership")) {
    data.myMembership = {
      linked: state.linked,
      memberships: state.memberships,
      requests: state.requests.map((r) => request(r.id)),
    };
  }
  if (query.includes("myApplication")) {
    data.myApplication = null;
  }
  if (query.includes("feeLevels")) {
    data.feeLevels = state.fees.filter((fee) => !fee.retired);
  }
  if (query.includes("requestPayment(")) {
    const ids = variables.feeLevelIds ?? [];
    const fees = state.fees.filter((fee) => ids.includes(fee.id));
    const created = {
      id: `req-${state.requests.length + 1}`,
      reference: `FGV26${["ABCD", "EFGH", "JKLM"][state.requests.length % 3]}`,
      amount: fees.reduce((sum, fee) => sum + fee.amount, 0),
      status: "OPEN",
      family: fees.some((fee) => fee.kind === "FAMILY"),
      memberships: fees.map((fee) => ({
        id: `m-${fee.id}`,
        year: fee.year ?? 2026,
        lifetime: fee.lifetime,
        status: "PENDING",
        spexareId: "sp-1",
      })),
    };

    state.requests.push(created);
    data.requestPayment = { id: created.id };
  }
  if (query.includes("paymentRequest(")) {
    data.paymentRequest = request(variables.id);
  }
  if (query.includes("reportPaid(")) {
    const r = state.requests.find((candidate) => candidate.id === variables.id);

    r.status = "REPORTED";
    r.paidBy = variables.paidBy ?? null;
    data.reportPaid = { id: r.id };
  }
  if (query.includes("waitingPaymentRequests")) {
    data.waitingPaymentRequests = state.requests
      .filter((r) => r.status === "OPEN" || r.status === "REPORTED")
      .map((r) => request(r.id));
  }
  if (query.includes("recordPayment(")) {
    const r = state.requests.find((candidate) => candidate.id === variables.requestId);

    r.status = "MATCHED";
    data.recordPayment = { id: r.id };
  }
  if (query.includes("paymentsThisYear")) {
    data.paymentsThisYear = state.requests
      .filter((r) => r.status === "MATCHED")
      .map((r) => ({
        id: `pay-${r.id}`,
        reference: r.reference,
        spexareName: "Greta Test",
        paidOn: "2026-11-27",
        amount: r.amount,
        how: "SWISH",
        note: null,
        transaction: false,
        externalReference: null,
      }));
  }
  if (query.includes("allFeeLevels")) {
    data.allFeeLevels = state.fees;
  }
  if (query.includes("feeLevelSave(")) {
    const input = variables.input;
    const fee = {
      id: input.id ?? `fee-${state.fees.length + 1}`,
      year: input.year,
      kind: input.kind,
      lifetime: input.kind === "LIFETIME",
      nameSv: input.nameSv,
      nameEn: input.nameEn,
      amount: input.amount,
      retired: false,
    };

    state.fees = input.id ? state.fees.map((f) => (f.id === input.id ? fee : f)) : [...state.fees, fee];
    data.feeLevelSave = { id: fee.id };
  }
  if (query.includes("saveSettings(")) {
    state.settings = {
      ...state.settings,
      ...variables.input,
      recipients: String(variables.input.recipients || "")
        .split(/[\s,;]+/)
        .filter(Boolean),
    };
    data.saveSettings = { reminderDays: state.settings.reminderDays };
  } else if (query.includes("settings {") || query.includes("settings{")) {
    data.settings = state.settings;
  }
  if (query.includes("memberTrend")) {
    data.memberTrend = [
      { year: 2025, members: 120, lifetime: 12, joined: 8 },
      { year: 2026, members: 3, lifetime: 12, joined: 1 },
    ];
  }
  if (query.includes("members(")) {
    data.members = [
      {
        membershipId: "m1",
        spexareId: "sp-1",
        name: "Greta Test",
        type: "FGV",
        year: 2026,
        lifetime: false,
        status: "PAID",
        how: "SWISH",
        note: null,
        optedOut: false,
        wasMemberLastYear: true,
        family: false,
        support: false,
      },
    ];
  }
  if (query.includes("bankFormats")) {
    data.bankFormats = [
      {
        id: "bf-1",
        name: "Swedbank",
        charset: "UTF-8",
        delimiter: ";",
        headerLines: 1,
        dateColumn: 1,
        amountColumn: 2,
        textColumn: 3,
        payerColumn: null,
        dateFormat: "yyyy-MM-dd",
        decimalComma: true,
      },
    ];
  }
  if (query.includes("unmatchedTransactions")) {
    data.unmatchedTransactions = [
      { id: "tx-1", bookedOn: "2026-11-20", amount: 200, text: "FGV26ABCD", payer: "Greta Test" },
    ];
  }
  if (query.includes("transactionSuggestions")) {
    data.transactionSuggestions = [];
  }
  if (query.includes("maintenanceJobs")) {
    data.maintenanceJobs = [
      {
        name: "PAYMENT_REMINDERS",
        description: "Remind payers of open requests",
        lastRun: "2026-11-25T03:50:00Z",
        lastResult: "0 handled",
      },
    ];
  }
  if (query.includes("auditLog")) {
    data.auditLog = [
      {
        at: "2026-11-25T10:00:00Z",
        actor: "user-1",
        actorName: "Greta Test",
        action: "ACCESS_CHANGED",
        subject: "user-2",
        detail: "fgv-membership: USER",
      },
    ];
  }
  if (query.includes("defaultAccess(")) {
    data.defaultAccess = [
      { clientId: "fgv-membership", name: "Membership", ladder: ["USER", "BOARD", "TREASURER", "ADMIN"], role: "USER" },
    ];
  }
  if (query.includes("membershipApplications")) {
    data.membershipApplications = [
      {
        id: "app-1",
        applicantName: "Sture Sökande",
        applicantEmail: "sture@example.org",
        text: "Spexade 1998",
        status: "PENDING",
        createdAt: "2026-11-20T10:00:00Z",
      },
    ];
  }
  if (query.includes("memberDetail(")) {
    data.memberDetail = {
      spexare: { id: "sp-1", firstName: "Greta", lastName: "Test", email: "greta@example.org" },
      optedOut: false,
      memberships: [{ id: "m1", year: 2026, lifetime: false, status: "PAID", how: "SWISH", note: null }],
      requests: [],
      emails: [],
    };
  }
  if (query.includes("spexareSearch")) {
    data.spexareSearch = [{ id: "sp-1", firstName: "Greta", lastName: "Test", email: "greta@example.org" }];
  }
  if (query.includes("user(")) {
    data.user = {
      id: "u1",
      email: "greta@example.org",
      displayName: "Greta Test",
      enabled: true,
      emailVerified: true,
      status: "ACTIVE",
      createdAt: "2026-11-01T10:00:00Z",
      registrationMessage: null,
      access: [
        {
          clientId: "fgv-membership",
          name: "Membership",
          ladder: ["USER", "BOARD", "TREASURER", "ADMIN"],
          highest: "ADMIN",
          consistent: true,
        },
      ],
    };
  }
  if (query.includes("users(")) {
    data.users = {
      total: 1,
      items: [
        {
          id: "u1",
          email: "greta@example.org",
          displayName: "Greta Test",
          firstName: "Greta",
          lastName: "Test",
          locale: "sv",
          enabled: true,
          emailVerified: true,
          status: "ACTIVE",
          createdAt: null,
          registrationMessage: null,
        },
      ],
    };
  }

  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ data }));
}

const accessToken = () =>
  new SignJWT({ ...USER, typ: "Bearer", azp: CLIENT_ID, resource_access: { "fgv-membership": { roles } } })
    .setProtectedHeader({ alg: "RS256", kid: KID, typ: "JWT" })
    .setIssuer(ISSUER)
    .setSubject(USER.sub)
    .setAudience("account")
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL}s`)
    .sign(privateKey);
const idToken = (nonce) =>
  new SignJWT({ ...USER, ...(nonce ? { nonce } : {}) })
    .setProtectedHeader({ alg: "RS256", kid: KID, typ: "JWT" })
    .setIssuer(ISSUER)
    .setSubject(USER.sub)
    .setAudience(CLIENT_ID)
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL}s`)
    .sign(privateKey);

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};

const server = createServer((req, res) => {
  const chunks = [];

  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", async () => {
    const url = new URL(req.url || "", `http://localhost:${PORT}`);
    const path = url.pathname;
    const body = Buffer.concat(chunks).toString("utf8");

    if (path.endsWith("/.well-known/openid-configuration")) {
      return json(res, 200, {
        issuer: ISSUER,
        authorization_endpoint: `${ISSUER}/protocol/openid-connect/auth`,
        token_endpoint: `${ISSUER}/protocol/openid-connect/token`,
        userinfo_endpoint: `${ISSUER}/protocol/openid-connect/userinfo`,
        jwks_uri: `${ISSUER}/protocol/openid-connect/certs`,
        end_session_endpoint: `${ISSUER}/protocol/openid-connect/logout`,
        response_types_supported: ["code"],
        subject_types_supported: ["public"],
        id_token_signing_alg_values_supported: ["RS256"],
      });
    }
    if (path.endsWith("/protocol/openid-connect/certs")) {
      return json(res, 200, { keys: [publicJwk] });
    }
    if (path.endsWith("/protocol/openid-connect/auth")) {
      const code = randomUUID();
      const target = new URL(url.searchParams.get("redirect_uri"));

      if (url.searchParams.get("prompt") === "none") {
        target.searchParams.set("error", "login_required");
      } else {
        pendingCodes.set(code, url.searchParams.get("nonce"));
        target.searchParams.set("code", code);
      }
      if (url.searchParams.get("state")) {
        target.searchParams.set("state", url.searchParams.get("state"));
      }
      res.writeHead(302, { location: target.toString() }).end();
      return;
    }
    if (path.endsWith("/protocol/openid-connect/token")) {
      const params = new URLSearchParams(body);
      const nonce = pendingCodes.get(params.get("code")) ?? null;

      pendingCodes.delete(params.get("code"));
      return json(res, 200, {
        access_token: await accessToken(),
        id_token: await idToken(nonce),
        refresh_token: `refresh-${randomUUID()}`,
        token_type: "Bearer",
        expires_in: TOKEN_TTL,
        scope: "openid profile email",
      });
    }
    if (path.endsWith("/protocol/openid-connect/userinfo")) {
      return json(res, 200, USER);
    }
    if (path.endsWith("/protocol/openid-connect/logout")) {
      res
        .writeHead(302, { location: url.searchParams.get("post_logout_redirect_uri") || `http://localhost:${PORT}/` })
        .end();
      return;
    }
    if (req.method === "POST" && path === "/__reset") {
      reset();
      return json(res, 200, {});
    }
    if (req.method === "POST" && path === "/__roles") {
      roles = JSON.parse(body).roles;
      return json(res, 200, {});
    }
    if (req.method === "POST" && path === "/__state") {
      state = { ...state, ...JSON.parse(body) };
      return json(res, 200, {});
    }
    if (req.method === "GET" && path === "/__calls") {
      return json(res, 200, calls);
    }
    if (req.method === "POST" && path === "/api/graphql") {
      return handleGraphql(body, res, req.headers.authorization);
    }
    if (req.method === "POST" && path === "/api/registration") {
      calls.push({ registration: JSON.parse(body) });
      return json(res, 202, { status: "verification-sent" });
    }
    if (req.method === "GET" && path.startsWith("/api/personal/")) {
      const token = path.split("/").pop();

      if (token.length < 40) {
        return json(res, 404, {});
      }
      return json(res, 200, {
        reference: "FGV26ABCD",
        amount: 200,
        paid: 0,
        status: "OPEN",
        years: [2026],
        swishNumber: "123 456 78 90",
        bankgiro: "123-4567",
        bankAccount: null,
        swishLink: "swish://payment?data=x",
        qr: null,
        optedOut: false,
      });
    }
    if (req.method === "POST" && path.startsWith("/api/personal/")) {
      calls.push({ personal: path, body });
      return json(res, 200, { ok: true });
    }
    json(res, 404, { error: "not mocked", path });
  });
});

server.listen(PORT, () => console.log(`[mock-backend] listening on http://localhost:${PORT}`));
