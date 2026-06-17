# 워크플로우: 디자인 파운데이션 / 리테마링 (design-foundation)

> 시안 → 토큰 → 글로벌 스타일 → 프리미티브. **껍데기와 페이지 사이의 사전작업.**
> 초기 킥오프에서도, 나중에 디자인이 도착/변경될 때도 **이 워크플로우로 재진입**한다(색·테마·다크모드 변경 포함).
> @참조: `_shared/tokens-and-style.md` · `_shared/gates.md`
> (스킬 훅 없음 — 시각·도구 작업이라 grill-me류 부적합)

## 0. 진입 판별
- **초기**(킥오프 경로 ③, 디자인 확정) / **리테마링**(색·테마 변경) / **임시값 채우기**(아이디어·기획만 경로 → 중립값).

## 1. 토큰 추출 → `app/styles/tokens.css`
- **파이프라인(현재): 수동 미러링.** Figma 스타일(색·타이포·스페이싱·radius·shadow)을 사람이 `tokens.css`에 입력. Figma가 진실 참조.
  - 래칫: 토큰이 안정되고 변경이 잦아지면 **Tokens Studio + Style Dictionary 자동화**로 승급(`workflow-change`).
- **2계층:** 원시(`--blue-500`) → 의미(`--color-*` `--space-*` `--font-*` `--radius-*` `--shadow-*`). **컴포넌트는 의미토큰만.** 컴포넌트 토큰(`--button-*`)은 정말 필요할 때만 래칫.
- 디자인 미확정이면 **중립 임시값**으로 채운다(구조만 통과).

## 2. 글로벌 스타일 (`app/styles/`)
- `global.scss`: modern-normalize + box-sizing border-box + body 기본(토큰 참조) + 포커스 가시성 + `prefers-reduced-motion` 존중.
- `mixins`: `focus-ring`(a11y) · `media-*`(브레이크포인트) · `visually-hidden`(스크린리더) · `truncate`.

## 3. 에센셜 프리미티브 (`app/components/ui/`)
- 1차 세트: **레이아웃**(Box·Stack·Container) · **타이포**(Text·Heading) · **폼**(Button·Input·Field=label+input+error).
- 시안에 **반복 출현**하는 요소를 우선 포함. 나머지 기능 컴포넌트는 페이지 작업 중 Rule of Three로 창발 추출(`_shared/reuse-vs-fork.md`).
- 각 프리미티브: 의미토큰만 사용 · `*.module.scss` · `*.stories.tsx` · `*.test.tsx`.

## 4. Storybook 문서화 (검수 표면)
- **Foundations** 섹션: 토큰 시각화(색 팔레트 · 타이포 스케일 · 스페이싱).
- **Primitives** 섹션: 각 프리미티브 스토리(상태별).

## 5. 완료 게이트 (경량 blocking — 통과해야 페이지 진입)
1. **[기계]** 프리미티브 렌더 + a11y 통과, 토큰 lint(의미토큰만·하드코딩 금지) 통과.
2. **[사람]** Storybook에서 **시안 대비 1회 시각 확인**(디자이너 또는 self). 임시값이면 "구조 정상"만 확인.
→ 통과하면 `feature-build`로 페이지 작업 진입 허용.

## 종료
- `docs:`/`feat:` 커밋. **리테마링이면** 영향받는 프리미티브를 Storybook에서 **시각 재검수**(회귀 방지).

## 하지 말 것
- 토큰 없이 페이지부터 시작, 하드코딩 색/원시토큰 직접 사용, 프리미티브 추측 양산, **게이트 없이 토큰 직접 수정**(리테마링도 반드시 이 워크플로우로).
