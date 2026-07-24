import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });
const config = [
  {
    ignores: [
      "node_modules/**",
      "node_modules-interrupted/**",
      ".next/**",
      "dist/**",
      "coverage/**"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript")
];
export default config;
