import {CodegenConfig} from "@graphql-codegen/cli";

// Introspection is off on the server, so the schema is read from a sibling fgv-membership-server checkout. The output in
// src/gql/ is committed, so CI needs no sibling. Run `npm run gql-codegen` after every schema change.
const schema = process.env.GRAPHQL_SCHEMA ?? "../fgv-membership-server/src/main/resources/graphql/*.graphqls";

const config: CodegenConfig = {
    schema,
    documents: ["src/**/*.{ts,tsx}", "!src/gql/**"],
    ignoreNoDocuments: true,
    generates: {
        "./src/gql/": {
            preset: "client",
            presetConfig: {
                fragmentMasking: false,
            },
            config: {
                enumsAsTypes: true,
                useTypeImports: true,
            },
            plugins: [],
        },
    },
};

export default config;
