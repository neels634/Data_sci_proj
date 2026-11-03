import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // separate Vite / Python projects with their own tooling (also excluded in tsconfig.json)
      "frontend/**",
      "crop-check/**",
      "backend/**",
      // the Android app wraps the web app; its bundled scripts are not app source
      "android/**",
    ],
  },
];

export default eslintConfig;
