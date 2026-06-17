# start.md — 프로젝트 초기 설치 오케스트레이터

> **너(AI 에이전트)에게 주는 지시서다.** 이 파일을 읽었다면 아래 Phase 0→8을 **순서대로, 질문 없이** 실행해 "당장 실무 개발이 가능한" 프로젝트를 만든다.
> 모든 스택·제약·보안 결정은 이미 확정돼 있다(아래 §확정 결정). **추가로 사람에게 묻지 마라.** 막히면 묻지 말고 §중단 규칙에 따라 *멈추고 보고*한다.
> 이 `start/` 번들은 **세팅이 끝나면 삭제**된다(Phase 8). 다른 프로젝트에도 그대로 재사용한다.

---

## 종료 상태 계약 (이 결과가 안 나오면 실패다)

1. `pnpm dev` 로 개발 서버가 뜨고, 예시 라우트·컴포넌트·로그인 흐름이 동작한다.
2. `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 가 **전부 통과**한다.
3. `start/` 번들이 **삭제**돼 프로젝트에 흔적이 없다.
4. **init 커밋 1개**가 찍혀 있고, 워킹 트리가 깨끗하다.

---

## 확정 결정 (변경 금지 — 이미 PL이 합의함)

| 영역 | 결정 |
|---|---|
| 프레임워크 | **React Router v7 (framework mode, 풀스택)**. import는 `react-router`에서. `@remix-run/*` **금지** |
| 언어 | TypeScript **strict** + `noUncheckedIndexedAccess` · `noImplicitOverride` · `noFallthroughCasesInSwitch` |
| 패키지매니저 | **pnpm** (corepack). Node **LTS** 고정(`.nvmrc` · `engines`) |
| DB / ORM | **PostgreSQL**(로컬 Docker Compose) + **Prisma** |
| 인증 | 자체 **httpOnly 세션쿠키** + **remix-auth** + **argon2id**. `secure`는 `NODE_ENV==="production"` 조건부 |
| 검증 / 폼 | **Zod**(모든 신뢰경계 입력) + **Conform** |
| 스타일 | **Sass + CSS Modules**. 디자인토큰 = **CSS 변수 2계층**(원시→의미), 컴포넌트는 **의미토큰만** 참조 |
| 컴포넌트 | **Storybook** (CDD, 사람 게이트 표면) |
| 클라 상태 | RR7 네이티브 우선(loader/action/useFetcher). 전역 스토어는 래칫으로만 추가 |
| Lint/Format | **ESLint(flat) + Prettier** |
| 테스트 | **Vitest + Testing Library**(단위=기계 게이트), **Playwright**(인증 등 핵심 플로우만) |
| Git 훅 | husky 계층형 + commitlint(Conventional Commits) |
| CI | **GitHub Actions** = 우회 불가 벽 |
| 아키텍처 | 기능(도메인) 기반. 라우트는 얇게, 로직은 `app/features/<도메인>`, 공용 프리미티브는 `app/components/ui` |

---

## 실행 Phase

### Phase 0 · 사전 점검 & 자동 정비 (Preflight — **유일한 멈춤 지점**)

> 목적: **작업이 중간에 멈추지 않도록**, 필요한 모든 것을 *여기서 한 번에* 확인하고 갖춘다.
> 자동으로 깔 수 있는 건 깐다. 사람 손이 필요한 건 **모아서 한 번만** 요청한다. 여기를 통과하면 Phase 1~8은 멈춤 없이 끝까지 간다.

**0-1. 전체 점검표를 먼저 한꺼번에 수집한다** (아직 아무것도 설치/생성하지 말 것):
- `node -v` — 현재 환경 LTS 이상인가
- `pnpm -v` — 있는가 (없으면 corepack으로 자동 정비 대상)
- `git --version` — 있는가
- `docker info` — Docker 데몬이 떠 있는가 (로컬 Postgres에 필요)
- OS 패키지 매니저 감지: macOS면 `brew`, Linux면 `apt`/`dnf` 등 (자동 설치에 사용)
- 현재 폴더가 git 저장소인가 (`git rev-parse` )

**0-2. 자동으로 정비 가능한 것은 즉시 정비한다:**
- **pnpm 없음** → `corepack enable && corepack prepare pnpm@latest --activate`. (Node가 있으면 거의 항상 자동 해결)
- **git 저장소 아님** → `git init`.
- **Playwright 브라우저** 등 런타임 의존 바이너리는 해당 Phase에서 `pnpm exec playwright install`로 자동 설치(여기선 존재만 확인).

**0-3. 사람 손이 필요한 항목은 자동 설치를 *시도*하되, 안 되면 모아서 안내한다:**
- **Node가 없거나 LTS 미만:**
  - `brew`/패키지매니저가 있으면 설치를 **제안**하고(예: `brew install node`), 사용자가 허용하면 실행. nvm이 감지되면 `nvm install --lts` 제안.
  - 자동 설치 수단이 없으면 → **부족 항목 목록에 추가**(중간에 멈추지 말고 0-4에서 일괄 처리).
- **Docker 없음/데몬 미기동:** 다음 두 경로 중 하나로 **반드시 결론을 내고** 넘어간다(여기서 미루면 Phase 6에서 멈추므로):
  - (a) 패키지매니저로 설치 제안(macOS: `brew install --cask docker` 후 Docker Desktop 실행 안내) → 설치·기동되면 로컬 DB 경로로 진행.
  - (b) **외부 Postgres 대체:** 사용자가 외부 `DATABASE_URL`(예: Neon·Supabase·사내 DB)을 제공하면 `.env`에 기록하고 **docker-compose를 건너뛴다**. 이 경우 Phase 6의 `docker compose up`은 생략하고 `prisma migrate`만 수행.
  - 둘 다 당장 불가하면 → 0-4 목록에 추가.

**0-4. 일괄 게이트:** 위에서 **자동 해결 못 한 항목이 하나라도 있으면**, *지금 한 번에* 모아 사용자에게 보고한다 — 무엇이/왜 필요하고, 각 설치 명령(또는 외부 `DATABASE_URL` 제공)을 제시. 사용자가 갖춘 뒤 **"다시 시작"하면 Phase 0부터 재실행**한다. (작업 도중이 아니라 시작 전에 모든 걸 갖추는 게 핵심.)

**0-5. 점검표가 모두 초록일 때만 Phase 1로 진행한다.**

### Phase 1 · 스캐폴드
- React Router v7 **framework template**로 앱을 현재 폴더에 생성한다(`create-react-router@latest .` 계열, 대화형 프롬프트는 비대화 플래그로 회피, 기본 TypeScript).
- 아래 폴더 골격을 만든다:
  ```
  app/
    components/ui/      # 디자인 프리미티브(공용)
    features/           # 도메인별 기능(기능당 폴더 완결)
    lib/                # 서버/공용 유틸(auth.server.ts, db.server.ts, env.server.ts, http.server.ts)
    styles/             # tokens.css, global.scss, mixins
    routes/             # 얇은 라우트
  docs/
    workflows/
    _shared/
  ```

### Phase 2 · 의존성 설치
- 런타임: `react-router` 생태계 기본 + `@conform-to/react @conform-to/zod zod remix-auth @node-rs/argon2 @prisma/client pino`
- 개발: `prisma vitest @vitejs/plugin-react vite-tsconfig-paths @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test eslint prettier eslint-config-prettier typescript-eslint eslint-plugin-jsx-a11y eslint-plugin-import eslint-plugin-boundaries husky lint-staged @commitlint/cli @commitlint/config-conventional sass storybook @storybook/react-vite @storybook/addon-a11y`
- 정확한 패키지명·버전은 RR7 템플릿이 깐 것과 충돌 없게 맞춘다. `@remix-run/*` 는 절대 추가하지 않는다.

### Phase 3 · 센서 배치 (벽)
- `templates/config/` 의 파일들을 프로젝트 루트로 복사하고 RR7 템플릿이 만든 동명 파일을 **덮어쓴다**:
  - `tsconfig.json` `eslint.config.js` `.prettierrc` `.prettierignore`
  - `commitlint.config.cjs` `.husky/pre-commit` `.husky/commit-msg` `.husky/pre-push`
  - `vitest.config.ts` `vitest.setup.ts` `playwright.config.ts`
  - `prisma/schema.prisma` `docker-compose.yml` `.env.example`
  - `.github/workflows/ci.yml` `.nvmrc` `.npmrc` `.editorconfig` `.gitignore`
  - `.vscode/settings.json` `.vscode/extensions.json` (IDE 무관 포맷 통일)
  - `scripts/check-docs.mjs` (문서 양식 센서)
- `package.json` 의 `scripts` · `lint-staged` · `engines` · `type` 블록을 `templates/config/package.scripts.json` 내용으로 병합한다.

### Phase 4 · 하네스(가이드) 배치
- `templates/AGENTS.md` → 프로젝트 루트 `AGENTS.md` (모든 에이전트 진실원천)
- `templates/CLAUDE.md` → 루트 `CLAUDE.md`, `templates/GEMINI.md` → 루트 `GEMINI.md` (둘 다 AGENTS.md를 가리키는 얇은 포인터)
- `templates/docs/*` → `docs/` 전체:
  - `docs/README.md`(문서 지도), `docs/product/overview.md`, `docs/specs/_template.md`, `docs/screens/_template.md`, `docs/data-model/_template.md`
  - `docs/decisions/_template.md`(ADR 결정 기록), `docs/PROGRESS.md`(진행 핸드오프), `docs/friction-log.md`(마찰 로그)
  - `docs/workflows/*`(project-kickoff 포함), `docs/_shared/*`(git-conventions 포함)

### Phase 5 · 보안 기반 코드 + 예시 1개
> **`templates/reference/security-snippets.md` 의 패턴을 그대로** 생성한다(결정성). 도메인에 맞게 모델/필드만 조정.
- `app/lib/env.server.ts`: Zod로 환경변수 검증(부팅 시 1회). 누락/오타면 즉시 throw.
- `app/lib/db.server.ts`: PrismaClient 싱글톤.
- `app/lib/auth.server.ts`: remix-auth + `createCookieSessionStorage`(httpOnly·sameSite=lax·secure 조건부) + argon2id 해시 유틸.
- `app/lib/headers.server.ts`: 보안 헤더(CSP·HSTS·X-Frame-Options·X-Content-Type-Options·Referrer-Policy)를 root에서 부여.
- `app/features/auth/`: 로그인 예시 — schema(zod) · route(loader/action) · 컴포넌트(Conform) · `*.module.scss` · `*.test.tsx` · `*.stories.tsx` 까지 **워크플로우 문서를 따른 모범 1세트**. 이후 개발자는 이걸 본보기로 삼는다.
- `app/styles/tokens.css`: 원시→의미 2계층 CSS 변수. 디자인 미확정이므로 **중립 임시값**으로 채워 두고(슬롯), 디자인 확정 시 `project-kickoff` 경로 ③에서 실값 주입.

### Phase 6 · 초기화
- `pnpm prisma generate`
- `pnpm exec husky init` 후 Phase 3에서 복사한 훅이 유지되는지 확인(덮였으면 재복사).
- **DB 기동(Phase 0의 결정에 따름):**
  - 로컬 Docker 경로면 `docker compose up -d` 로 Postgres 기동.
  - 외부 `DATABASE_URL` 경로면 docker-compose는 **생략**(이미 `.env`에 연결정보 있음).
- `pnpm prisma migrate dev --name init`
- `pnpm exec playwright install` (E2E 브라우저 바이너리 — Phase 0에서 미설치였다면 여기서 자동 설치).
- 필요한 시드가 있으면 최소 시드.

### Phase 7 · 검증 게이트 (기계가 먼저 — 깨진 채 커밋 금지)
- 순서대로 실행하고 **전부 통과해야** Phase 8로 간다:
  1. `pnpm typecheck`
  2. `pnpm lint`
  3. `pnpm test`
  4. `pnpm build`
- 하나라도 실패하면: **고친다.** 환경 문제(예: Docker 미기동)면 §중단 규칙으로 *멈추고 보고*. **절대 실패를 숨기고 진행하지 않는다.**

### Phase 8 · 정리 + init 커밋
1. `start/` 폴더를 **통째로 삭제**한다(이 파일 자신 포함).
2. `.gitignore` 에 `node_modules` · `.env` · 빌드 산출물이 포함됐는지 확인.
3. `git add -A`
4. `git commit -m "chore: initial project setup"`
5. 사람에게 **종료 보고**: 무엇이 깔렸는지, `pnpm dev` 로 시작하는 법, **두 번째 스텝은 `docs/workflows/project-kickoff.md`**, 이후 작업은 `AGENTS.md` 라우터를 따르며 **세션 진행은 `docs/PROGRESS.md`로 이어받는다**는 안내.

---

## 중단 규칙 (막혔을 때)
- **멈출 수 있는 곳은 Phase 0(Preflight) 한 곳뿐이다.** 환경/도구/외부 의존성 문제는 *전부 Phase 0에서* 자동 정비하거나 일괄 요청해 해결한다. Phase 1부터는 환경 문제로 멈추지 않는다(이미 Phase 0에서 걸렀으므로).
- 사람에게 **설계를 되묻지 않는다**(결정은 끝났다). Phase 0에서 갖춰야 할 게 있으면 *목록으로 한 번에* 요청한다.
- 그럼에도 Phase 1~7에서 예기치 못하게 막히면: *무엇이 왜 막혔고 사람이 무엇을 해주면 되는지* 한 단락으로 보고하고 멈춘다(깨진 결과를 진행/커밋하지 않는다).
- **불변식을 우회하지 않는다:** 테스트/타입/lint를 끄거나 `--no-verify`, `any`, `eslint-disable`, `@ts-ignore` 로 통과시키지 않는다.

## 다음 스텝 안내 (종료 보고에 포함)
- 설치 후 **두 번째 스텝**은 `docs/workflows/project-kickoff.md` — 아이디어/기획/기획+디자인 성숙도에 따라 `docs/`(기본정의·기능정의서·화면정의서·데이터모델)를 채운다.
- 이후 모든 작업(기능·컴포넌트·라우트·버그·워크플로우 수정)은 루트 `AGENTS.md`(=Claude는 CLAUDE.md, Gemini는 GEMINI.md가 가리킴)의 **라우터**가 `docs/workflows/<작업>.md` 하나로 안내한다.
- 어떤 에이전트로 열어도 자기 기본 파일 → `AGENTS.md` → `docs/README.md` 지도를 따라 **같은 규약**으로 동작한다.
