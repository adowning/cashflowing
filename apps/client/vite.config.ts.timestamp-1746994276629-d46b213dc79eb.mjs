// vite.config.ts
import { defineConfig } from "file:///home/ash/Documents/cashflow/node_modules/vite/dist/node/index.js";
import vue from "file:///home/ash/Documents/cashflow/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import AutoImport from "file:///home/ash/Documents/cashflow/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///home/ash/Documents/cashflow/node_modules/unplugin-vue-components/dist/vite.js";
import AppLoading from "file:///home/ash/Documents/cashflow/node_modules/vite-plugin-app-loading/dist/index.js";
import vueDevTools from "file:///home/ash/Documents/cashflow/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_dirname = "/home/ash/Documents/cashflow/apps/client";
var proxy = {
  "/auth/login": {
    target: "http://localhost:6589",
    secure: false,
    rewrite: (path2) => path2.replace(/^\/api/, "/"),
    headers: { Connection: "keep-alive" }
  },
  "/auth/me": {
    target: "http://localhost:6589",
    secure: false,
    rewrite: (path2) => path2.replace(/^\/api/, "/"),
    headers: { Connection: "keep-alive" }
  },
  "/auth/google": {
    target: "http://localhost:6589",
    secure: false,
    rewrite: (path2) => path2.replace(/^\/api/, "/"),
    headers: { Connection: "keep-alive" }
  },
  "/auth/register": {
    target: "http://localhost:6589",
    secure: false,
    rewrite: (path2) => path2.replace(/^\/api/, "/"),
    headers: { Connection: "keep-alive" }
  },
  "/api": {
    target: "http://localhost:6589",
    secure: false,
    rewrite: (path2) => path2.replace(/^\/api/, "/api"),
    headers: { Connection: "keep-alive" }
  }
  // '/auth': {
  //   target: 'http://localhost:6589',
  //   secure: false,
  //   // rewrite: (path) => path.replace(/^\/auth/, 'auth'),
  //   headers: { Connection: 'keep-alive' },
  // },
  // '/user/connect/ws': { target: 'http://localhost:3001/user/connect/ws', ws: true },
};
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueDevTools({ launchEditor: "code" }),
    AutoImport({
      imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
      dts: "src/types/auto/auto-imports.d.ts",
      dirs: ["src/composables"],
      eslintrc: {
        enabled: true
        // <-- this
      },
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/]
    }),
    AppLoading(),
    // 自动按需导入组件
    Components({
      dts: "src/types/auto/components.d.ts",
      extensions: ["vue"],
      include: [/\.vue$/, /\.vue\?vue/],
      resolvers: [
        // RekaResolver(),
        // RekaResolver({
        //   prefix: '' // use the prefix option to add Prefix to the imported components
        // })
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      // Alias @ to src directory
      "@cashflow/types": path.resolve(__vite_injected_original_dirname, "../../packages/types/src")
      // Alias for shared types
    }
  },
  build: {
    outDir: "dist",
    // Output directory for production build
    sourcemap: true
    // Generate source maps for debugging
  },
  server: {
    port: 3e3,
    allowedHosts: ["test.cashflowcasino.com", "localhost"],
    proxy
  },
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hc2gvRG9jdW1lbnRzL2Nhc2hmbG93L2FwcHMvY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hc2gvRG9jdW1lbnRzL2Nhc2hmbG93L2FwcHMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2FzaC9Eb2N1bWVudHMvY2FzaGZsb3cvYXBwcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjsvLyBhcHBzL2NsaWVudC92aXRlLmNvbmZpZy50c1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjsgLy8gSW1wb3J0IHBhdGggbW9kdWxlIGZvciByZXNvbHZpbmcgYWxpYXNlc1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIjtcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XG5pbXBvcnQgQXBwTG9hZGluZyBmcm9tIFwidml0ZS1wbHVnaW4tYXBwLWxvYWRpbmdcIjtcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tIFwidml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzXCI7XG5cbmNvbnN0IHByb3h5OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBhbnk+ID0ge1xuICBcIi9hdXRoL2xvZ2luXCI6IHtcbiAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo2NTg5XCIsXG4gICAgc2VjdXJlOiBmYWxzZSxcbiAgICByZXdyaXRlOiAocGF0aDogc3RyaW5nKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlxcL1wiKSxcblxuICAgIGhlYWRlcnM6IHsgQ29ubmVjdGlvbjogXCJrZWVwLWFsaXZlXCIgfSxcbiAgfSxcbiAgXCIvYXV0aC9tZVwiOiB7XG4gICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NjU4OVwiLFxuICAgIHNlY3VyZTogZmFsc2UsXG4gICAgcmV3cml0ZTogKHBhdGg6IHN0cmluZykgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcXC9cIiksXG5cbiAgICBoZWFkZXJzOiB7IENvbm5lY3Rpb246IFwia2VlcC1hbGl2ZVwiIH0sXG4gIH0sXG4gIFwiL2F1dGgvZ29vZ2xlXCI6IHtcbiAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo2NTg5XCIsXG4gICAgc2VjdXJlOiBmYWxzZSxcbiAgICByZXdyaXRlOiAocGF0aDogc3RyaW5nKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlxcL1wiKSxcblxuICAgIGhlYWRlcnM6IHsgQ29ubmVjdGlvbjogXCJrZWVwLWFsaXZlXCIgfSxcbiAgfSxcbiAgXCIvYXV0aC9yZWdpc3RlclwiOiB7XG4gICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NjU4OVwiLFxuICAgIHNlY3VyZTogZmFsc2UsXG4gICAgcmV3cml0ZTogKHBhdGg6IHN0cmluZykgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcXC9cIiksXG5cbiAgICBoZWFkZXJzOiB7IENvbm5lY3Rpb246IFwia2VlcC1hbGl2ZVwiIH0sXG4gIH0sXG4gIFwiL2FwaVwiOiB7XG4gICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NjU4OVwiLFxuICAgIHNlY3VyZTogZmFsc2UsXG4gICAgcmV3cml0ZTogKHBhdGg6IHN0cmluZykgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCIvYXBpXCIpLFxuICAgIGhlYWRlcnM6IHsgQ29ubmVjdGlvbjogXCJrZWVwLWFsaXZlXCIgfSxcbiAgfSxcblxuICAvLyAnL2F1dGgnOiB7XG4gIC8vICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo2NTg5JyxcbiAgLy8gICBzZWN1cmU6IGZhbHNlLFxuICAvLyAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hdXRoLywgJ2F1dGgnKSxcbiAgLy8gICBoZWFkZXJzOiB7IENvbm5lY3Rpb246ICdrZWVwLWFsaXZlJyB9LFxuICAvLyB9LFxuICAvLyAnL3VzZXIvY29ubmVjdC93cyc6IHsgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDozMDAxL3VzZXIvY29ubmVjdC93cycsIHdzOiB0cnVlIH0sXG59O1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIHZ1ZURldlRvb2xzKHsgbGF1bmNoRWRpdG9yOiBcImNvZGVcIiB9KSxcblxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW1wb3J0czogW1widnVlXCIsIFwidnVlLXJvdXRlclwiLCBcInBpbmlhXCIsIFwiQHZ1ZXVzZS9jb3JlXCJdLFxuICAgICAgZHRzOiBcInNyYy90eXBlcy9hdXRvL2F1dG8taW1wb3J0cy5kLnRzXCIsXG4gICAgICBkaXJzOiBbXCJzcmMvY29tcG9zYWJsZXNcIl0sXG4gICAgICBlc2xpbnRyYzoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLCAvLyA8LS0gdGhpc1xuICAgICAgfSxcbiAgICAgIGluY2x1ZGU6IFsvXFwuW3RqXXN4PyQvLCAvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvXSxcbiAgICB9KSxcbiAgICBBcHBMb2FkaW5nKCksXG4gICAgLy8gXHU4MUVBXHU1MkE4XHU2MzA5XHU5NzAwXHU1QkZDXHU1MTY1XHU3RUM0XHU0RUY2XG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkdHM6IFwic3JjL3R5cGVzL2F1dG8vY29tcG9uZW50cy5kLnRzXCIsXG4gICAgICBleHRlbnNpb25zOiBbXCJ2dWVcIl0sXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlL10sXG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgLy8gUmVrYVJlc29sdmVyKCksXG4gICAgICAgIC8vIFJla2FSZXNvbHZlcih7XG4gICAgICAgIC8vICAgcHJlZml4OiAnJyAvLyB1c2UgdGhlIHByZWZpeCBvcHRpb24gdG8gYWRkIFByZWZpeCB0byB0aGUgaW1wb3J0ZWQgY29tcG9uZW50c1xuICAgICAgICAvLyB9KVxuICAgICAgXSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSwgLy8gQWxpYXMgQCB0byBzcmMgZGlyZWN0b3J5XG4gICAgICBcIkBjYXNoZmxvdy90eXBlc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uLy4uL3BhY2thZ2VzL3R5cGVzL3NyY1wiKSwgLy8gQWxpYXMgZm9yIHNoYXJlZCB0eXBlc1xuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBcImRpc3RcIiwgLy8gT3V0cHV0IGRpcmVjdG9yeSBmb3IgcHJvZHVjdGlvbiBidWlsZFxuICAgIHNvdXJjZW1hcDogdHJ1ZSwgLy8gR2VuZXJhdGUgc291cmNlIG1hcHMgZm9yIGRlYnVnZ2luZ1xuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIGFsbG93ZWRIb3N0czogW1widGVzdC5jYXNoZmxvd2Nhc2luby5jb21cIiwgXCJsb2NhbGhvc3RcIl0sXG4gICAgcHJveHksXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFtcIkBlbGVjdHJpYy1zcWwvcGdsaXRlXCJdLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0Is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
