// ESLint flat config — 이 프로젝트의 "벽"(센서).
// 핵심 보안/경계 규칙은 부탁이 아니라 여기서 강제된다. 우회(eslint-disable) 금지.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import boundaries from "eslint-plugin-boundaries";

export default tseslint.config(
  { ignores: ["build/", ".react-router/", "node_modules/", "coverage/", "!.storybook/"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { "jsx-a11y": jsxA11y, import: importPlugin, boundaries },
    settings: {
      "boundaries/elements": [
        { type: "ui", pattern: "app/components/ui/*" },
        { type: "feature", pattern: "app/features/*", capture: ["domain"] },
        { type: "lib", pattern: "app/lib/*" },
        { type: "route", pattern: "app/routes/*" },
      ],
    },
    rules: {
      // --- 프레임워크: Remix 옛 경로 금지 ---
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@remix-run/*"], message: "React Router v7을 쓴다. 'react-router'에서 import." },
          ],
        },
      ],

      // --- 타입 안전: any 차단(센서 무력화 방지) ---
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",

      // --- 신뢰경계: 토큰을 브라우저 저장소에 두지 마라 ---
      "no-restricted-properties": [
        "error",
        { object: "localStorage", property: "setItem", message: "인증 토큰은 httpOnly 세션쿠키로만. localStorage 금지." },
        { object: "sessionStorage", property: "setItem", message: "민감정보는 서버 세션으로. 브라우저 저장소 금지." },
      ],

      // --- 접근성 ---
      ...jsxA11y.configs.recommended.rules,

      // --- 기능 간 경계 강제 ---
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "feature", allow: ["ui", "lib", ["feature", { domain: "${from.domain}" }]] },
            { from: "route", allow: ["ui", "lib", "feature"] },
            { from: "ui", allow: ["ui", "lib"] },
            { from: "lib", allow: ["lib"] },
          ],
        },
      ],
    },
  },
  // 서버 전용 모듈은 클라이언트 컴포넌트에서 import 금지(시크릿 유출 차단)
  {
    files: ["app/**/*.tsx"],
    ignores: ["app/**/*.server.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["**/*.server", "**/*.server.ts"], message: "서버 전용 모듈(*.server)은 클라이언트 컴포넌트에서 import 금지." },
            { group: ["@remix-run/*"], message: "'react-router'에서 import." },
          ],
        },
      ],
    },
  },
);
