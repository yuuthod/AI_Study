# CLAUDE.md — 프로젝트 라우터 & 불변 규칙

> 이 프로젝트의 **하네스 진입점**이다. 모든 작업은 여기서 시작한다.
> 역할: ① 들어온 작업을 **분류**하고 → ② **워크플로우 문서 하나**로 보낸다. 그게 전부다(얇은 오케스트레이터).
> 상세 절차는 이 파일에 적지 않는다. 각 `docs/workflows/<작업>.md` 에 있다. **한 작업엔 문서 하나만 붙인다.**

---

## ① 라우터 — 먼저 작업을 분류한다 (추론적 게이트)

들어온 요청을 아래 한 버킷으로 분류하고, 해당 워크플로우 문서 **하나만** 열어 그대로 따른다.

| 작업 유형 | 신호 | 열 문서 |
|---|---|---|
| **기능/페이지 추가** | "~화면/기능 만들어줘", 새 흐름 | `docs/workflows/feature-build.md` |
| **컴포넌트 작업** | 단일 UI 컴포넌트 신규/수정 | `docs/workflows/component-create.md` |
| **라우트/서버 작업** | loader·action·API·인증·DB 접근 | `docs/workflows/route-create.md` |
| **버그 수정** | "~가 안 돼/에러" | `docs/workflows/bug-fix.md` |
| **워크플로우 자체 수정** | 이 하네스(문서·규칙·센서)를 바꾸려 함 | `docs/workflows/workflow-change.md` |

**분류 규칙 (river 모델):**
- **확신이 낮거나 모호하면 추측하지 말고 되묻는다.** "이 작업으로 보이는데 이 워크플로우로 갈까요?"
- **섞인 작업이면 쪼갠다.** "폼 만들고 + 버그도 고쳐"는 두 작업 → 분리 제안 후 각각 라우팅.
- 큰 기능은 `feature-build` 가 상위 오케스트레이터고, 그 안에서 컴포넌트/라우트 루프를 호출한다.
- 정의된 버킷이 없으면: 기존 워크플로우 **조합**으로 처리하고, *새 워크플로우가 필요하면* `workflow-change` 로 간다(PR+승인).

---

## ② 불변 규칙 (요약 — 어기면 센서가 막는다)

> 이건 *부탁이 아니라 벽*이다. 아래는 요약이고, 실제 강제는 ESLint·tsconfig·husky·CI·테스트가 한다. 우회(`--no-verify`·`any`·`eslint-disable`·`@ts-ignore`) 금지.

**프레임워크**
- import는 `react-router` 에서. **`@remix-run/*` 금지**(lint 차단).

**경계 / 보안 (신뢰 경계 = loader·action)**
- loader/action에 들어오는 **모든 입력(formData·params·search·외부응답)은 Zod로 파싱**한 뒤 사용한다. raw 접근 금지.
- 시크릿·DB·외부 API 호출은 **`*.server.ts`** 에만. 클라이언트로 새면 lint가 막는다.
- 인증 토큰은 **httpOnly 세션쿠키**로만. **`localStorage`/`document.cookie` 저장 금지**(lint 차단).
- 권한이 필요한 loader/action은 **맨 앞에서 인증/인가 가드**를 통과시킨다.

**아키텍처**
- 로직은 `app/features/<도메인>/` 에 완결. 라우트는 얇게(loader/action + 조립).
- **기능끼리 직접 import 금지**(`eslint-plugin-boundaries`). 공유는 `app/components/ui` · `app/lib` · `docs/_shared` 규칙으로.

**스타일**
- `*.module.scss` + **의미토큰(`--color-*` 등)만** 참조. 원시토큰·하드코딩 색상 직접 사용 금지.

**게이트 (river 모델)**
- 경계 *안*은 자율 실행(안 멈춤), 경계*선*에서 게이트. 사람은 양 끝(설계·시각 검수)에만.
- **기계 게이트(타입·lint·테스트·렌더)를 먼저 통과**해야 사람을 부른다. 사람 시간이 가장 비싸다.

---

## ③ 작업 후 (모든 워크플로우 공통 종료)
- 변경은 **Conventional Commits**(`feat:` `fix:` `refactor:` `docs:` …)로 커밋 → 라우터 분류와 일치.
- 작업 단위 = 브랜치/PR. **CI(우회 불가 벽)** 통과해야 머지.
- 하네스(이 문서·워크플로우·센서) 자체를 바꿨다면 반드시 `workflow-change` 절차(PR+사람 승인 = 래칫).

---

### 참고 — `docs/_shared/` 프래그먼트 (작업이 필요로 할 때만 그 워크플로우가 @참조)
- `gates.md` — 기계/사람 게이트 기준
- `security-checklist.md` — 신뢰경계 체크(route 작업)
- `naming-and-structure.md` — 폴더·네이밍·import 경계
- `tokens-and-style.md` — 토큰·Sass 규약
- `reuse-vs-fork.md` — 재사용/조합/fork 판단
