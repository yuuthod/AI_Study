# 공유: 폴더 · 네이밍 · import 경계

## 폴더 (기능 기반)
```
app/
  components/ui/         # 공용 디자인 프리미티브(Button, Input …) — 도메인 무관
  features/<도메인>/      # 한 기능 완결: components/ model/ *.schema.ts *.server.ts route 조각
  lib/                   # 서버/공용 유틸 (*.server.ts: db, auth, env, http, headers)
  routes/                # 얇은 라우트 (loader/action + 조립)
  styles/                # tokens.css, global.scss, mixins
```

## 네이밍
- 컴포넌트 파일/심볼: `PascalCase` (`LoginForm.tsx`, `LoginForm.module.scss`).
- 서버 전용: **`*.server.ts`** (클라 번들 격리 — 규칙이자 lint 대상).
- 스키마: `*.schema.ts`, 테스트: `*.test.ts(x)`, 스토리: `*.stories.tsx`.
- 훅: `useXxx`, 불리언: `isXxx/hasXxx` (단, 동작 분기 boolean 남발은 fork 신호 → `reuse-vs-fork.md`).

## import 경계 (eslint-plugin-boundaries 강제)
- **기능끼리 직접 import 금지.** `features/a` 가 `features/b` 내부를 import 못 함.
- 공유 방향: `features/*` → `components/ui`, `lib/*` (단방향). 역방향 금지.
- `*.server.ts` 는 클라 컴포넌트에서 import 금지(서버 코드 유출 차단).
- `@remix-run/*` import 금지 — `react-router` 사용.

> 경계는 글이 아니라 **lint가 막는다**. 우회하지 말 것.
