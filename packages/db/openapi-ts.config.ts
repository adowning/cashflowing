// import { defaultPlugins } from "@hey-api/openapi-ts";

// export default {
//   input: "./src/openapi.yaml",
//   output: "src/sdk/client",
//   plugins: [
//     ...defaultPlugins,
//     "@hey-api/client-axios",
//     // "zod",
//     // "@tanstack/vue-query",
//     {
//       asClass: true, // default
//       // name: '@cashflow/sdk',
//       runtimeConfigPath: "./src/sdk/cashflow-api.ts",
//     },
//   ],
// };
import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  logs: {
    level: "debug",
  },
  input:
    "https://pykjixfuargqkjkgxsyc.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5a2ppeGZ1YXJncWtqa2d4c3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMDEyMjIsImV4cCI6MjAyMjg3NzIyMn0.t2ayCugyEAii4KHDG0rWRZcvQcILYtF_-UApm0XGlKg",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/client",
  },
  plugins: [
    "@hey-api/client-axios",
    "@hey-api/schemas",
    {
      dates: true,
      name: "@hey-api/transformers",
    },
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
    {
      name: "@hey-api/sdk",
      transformer: true,
    },
  ],
});
