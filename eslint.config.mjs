import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      ".now/**",
      "dist/**",
      "esm/**",
      "public/**",
      "scripts/**",
      "node_modules/**",
      "coverage/**",
      ".next/**",
      "build/**",
      ".changeset/**",
    ],
  },

  // Next.js core-web-vitals (native flat config)
  nextPlugin.configs["core-web-vitals"],

  // Main config for all TS/TSX/JS/JSX files
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      prettier: prettierPlugin,
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React
      ...reactPlugin.configs.recommended.rules,
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": "off",

      // React Hooks
      ...reactHooksPlugin.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "off",

      // Accessibility
      ...jsxA11yPlugin.configs.recommended.rules,
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",

      // Prettier
      ...prettierConfig.rules,
      "prettier/prettier": "warn",

      // TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_.*?$",
        },
      ],

      // Unused imports
      "unused-imports/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",

      // General
      "no-console": "off",
      "padding-line-between-statements": "off",
    },
  },
];
