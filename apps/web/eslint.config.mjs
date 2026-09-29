import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const layers = ["shared", "services", "entities", "features", "views", "app"];

function allow(from, allowed) {
  return {
    from: [{ element: { type: from } }],
    allow: allowed.map((type) => ({ to: { element: { type } } })),
  };
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": layers.map((type) => ({
        type,
        pattern:
          type === "app" || type === "views" || type === "shared" || type === "services"
            ? `src/${type}/**`
            : `src/${type}/*/**`,
        capture: type === "features" || type === "entities" ? ["module"] : undefined,
      })),
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          policies: [
            allow("shared", ["shared"]),
            allow("services", ["shared", "services", "entities"]),
            allow("entities", ["shared", "services", "entities"]),
            allow("features", ["shared", "services", "entities", "features"]),
            allow("views", ["shared", "entities", "features", "views"]),
            allow("app", ["shared", "services", "entities", "features", "views", "app"]),
          ],
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*/*",
                "!@/features/*/index",
                "@/entities/*/*",
                "!@/entities/*/index",
              ],
              message: "Import from the module's public API (index.ts) instead of a deep path.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
