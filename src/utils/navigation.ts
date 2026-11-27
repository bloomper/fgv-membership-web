import {
  BookUser,
  Building2,
  ClipboardList,
  FileSpreadsheet,
  History,
  House,
  IdCard,
  KeyRound,
  Landmark,
  type LucideIcon,
  Receipt,
  RefreshCw,
  Settings,
  SlidersHorizontal,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import type { Role } from "@/types/auth";

export type NavEntry = {
  /** The message key under `Nav`. */
  key: string;
  url: string;
  icon: LucideIcon;
};

export type NavGroup = {
  key: string;
  icon: LucideIcon;
  /** The role that sees the group. */
  role: Role;
  items: NavEntry[];
};

export const HOME: NavEntry = { key: "home", url: "/", icon: House };
export const MEMBERSHIP: NavEntry = { key: "membership", url: "/membership", icon: IdCard };

/** The sections of the menu, in order; each is for its role and the roles above it. */
export const GROUPS: NavGroup[] = [
  {
    key: "board",
    icon: BookUser,
    role: "BOARD",
    items: [
      { key: "members", url: "/board/members", icon: Users },
      { key: "applications", url: "/board/applications", icon: ClipboardList },
      { key: "renewals", url: "/board/renewals", icon: RefreshCw },
    ],
  },
  {
    key: "treasurer",
    icon: Wallet,
    role: "TREASURER",
    items: [
      { key: "payments", url: "/treasurer/payments", icon: Receipt },
      { key: "bank", url: "/treasurer/transactions", icon: Landmark },
      { key: "import", url: "/treasurer/import", icon: FileSpreadsheet },
    ],
  },
  {
    key: "admin",
    icon: Settings,
    role: "ADMIN",
    items: [
      { key: "users", url: "/admin/users", icon: KeyRound },
      { key: "fees", url: "/admin/fees", icon: Receipt },
      { key: "defaults", url: "/admin/defaults", icon: SlidersHorizontal },
      { key: "bankFormats", url: "/admin/bank-formats", icon: Building2 },
      { key: "settings", url: "/admin/settings", icon: Settings },
      { key: "maintenance", url: "/admin/maintenance", icon: Wrench },
      { key: "audit", url: "/admin/audit", icon: History },
    ],
  },
];

export const hasRoleFor = (roles: readonly Role[], role: Role) => roles.includes(role);
