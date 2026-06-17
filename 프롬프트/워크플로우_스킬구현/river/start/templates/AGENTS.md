# AGENTS.md — 프로젝트 라우터 & 불변 규칙 (모든 에이전트 공통 진실원천)

> 이 파일이 **모든 AI 에이전트의 단일 진실원천**이다. Claude는 `CLAUDE.md`, Gemini는 `GEMINI.md`를 먼저 보지만 둘 다 이 파일을 가리킨다.
> 역할: ① 들어온 작업을 **분류**하고 → ② **워크플로우 문서 하나**로 보낸다. 상세 절차는 `docs/workflows/<작업>.md`에 있다. **한 작업엔 문서 하나만 붙인다.**

---

## ① 라우터 — 먼저 작업을 분류한다 (추론적 게이트)

| 작업 유형 | 신호 | 열 문서 |
|---|---|---|
| **프로젝트 시작 / 기획 추가** | 첫 셋업, 아이디어·기획·기능정의서·화면정의서 제공 | `docs/workflows/project-kickoff.md` |
| **디자인 파운데이션 / 리테마링** | 시안→토큰·프리미티브, 색/테마/다크모드 변경 | `docs/workflows/design-foundation.md` |
| **기능/페이지 추가** | "~화면/기능 만들어줘", 새 흐름 | `docs/workflows/feature-build.md` |
| **컴포넌트 작업** | 단일 UI 컴포넌트 신규/수정 | `docs/workflows/component-create.md` |
| **라우트/서버 작업** | loader·action·API·인증·DB 접근 | `docs/workflows/route-create.md` |
| **버그 수정** | "~가 안 돼/에러" | `docs/workflows/bug-fix.md` |
| **워크플로우 자체 수정** | 이 하네스(문서·규칙·센서)를 바꾸려 함 | `docs/workflows/workflow-change.md` |

**분류 규칙:** 확신 낮거나 모호 → 추측 말고 되묻는다. 섞인 작업 → 쪼갠다. 정의된 버킷 없으면 기존 조합, 새 워크플로우는 `workflow-change`(PR+승인).

---

## ② 문서/지식 — 무엇을 참고하나 (작업 전 필수)

> **문서는 `docs/README.md`(문서 지도)를 따른다.** 어떤 기획/정의 문서가 어디에 어떤 양식으로 있는지, 언제 무엇을 참고하는지가 거기 있다.

- **기능을 분석·계획·의문 제기할 땐** 먼저 `docs/product/overview.md`(프로젝트 기본 정의: 목적·대상·용어·범위·비기능요구)를 읽는다. 모든 판단의 기준점이다.
- 기능정의서 = `docs/specs/<기능>.md`, 화면정의서 = `docs/screens/<화면>.md`, 데이터 = `docs/data-model/` + `prisma/schema.prisma`(구현 진실원천).
- **새 기획/정의 문서를 만들 땐 `docs/README.md` 지도가 정한 위치·템플릿을 그대로 따른다.** 경로를 임의로 정하지 않는다(센서가 검사한다).

---

## ③ 불변 규칙 (요약 — 어기면 센서가 막는다)

> 부탁이 아니라 *벽*이다. 실제 강제는 ESLint·tsconfig·husky·CI·테스트가 한다. 우회(`--no-verify`·`any`·`eslint-disable`·`@ts-ignore`) 금지.

**프레임워크:** import는 `react-router`에서. **`@remix-run/*` 금지**(lint).

**경계/보안 (신뢰 경계 = loader·action):**
- 모든 입력(formData·params·search·외부응답)은 **Zod로 파싱** 후 사용. raw 접근 금지.
- 시크릿·DB·외부 호출은 **`*.server.ts`** 에만(클라 유출 시 lint 차단).
- 인증 토큰은 **httpOnly 세션쿠키**로만. `localStorage`/`document.cookie` 저장 금지(lint).
- 권한 필요한 loader/action은 맨 앞에서 인증/인가 가드.

**아키텍처:** 로직은 `app/features/<도메인>/`에 완결, 라우트는 얇게. **기능끼리 직접 import 금지**(`eslint-plugin-boundaries`).

**스타일:** `*.module.scss` + **의미토큰(`--color-*`)만**. 하드코딩 색/원시토큰 직접 사용 금지.

**게이트:** 경계 안=자율, 경계선=게이트. 사람은 양 끝(설계·시각 검수)에만. **기계 게이트(타입·lint·테스트·렌더) 먼저 통과**해야 사람을 부른다.

---

## ④ 작업 후 (모든 워크플로우 공통 종료)
- 브랜치·커밋 규칙은 **`docs/_shared/git-conventions.md`** 를 따른다(Conventional Commits, 타입 영어+제목 한글).
- 작업 단위 = 브랜치/PR. **CI(우회 불가 벽)** 통과해야 머지.
- 하네스(이 문서·워크플로우·센서·`docs/README.md`)를 바꿨다면 `workflow-change` 절차(PR+승인). **AGENTS.md를 고치면 `CLAUDE.md`·`GEMINI.md` 포인터도 동기 확인.**

---

### `docs/_shared/` 프래그먼트 (작업이 필요로 할 때만 @참조)
`gates.md` · `security-checklist.md` · `naming-and-structure.md` · `tokens-and-style.md` · `reuse-vs-fork.md` · `git-conventions.md`
