// Conventional Commits 강제 — 커밋 타입이 CLAUDE.md 라우터 분류와 일치한다.
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "docs", "test", "chore", "style", "perf", "ci", "build", "revert"],
    ],
  },
};
