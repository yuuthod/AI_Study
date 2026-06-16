# 워크플로우: 컴포넌트 작업 (component-create / modify)

> UI 컴포넌트 한 개의 신규/수정. **보이는 산출물 → 사람 시각 게이트가 있는 작업.**
> @참조: `_shared/tokens-and-style.md` · `_shared/gates.md` · `_shared/naming-and-structure.md` · (수정 시) `_shared/reuse-vs-fork.md`
> ⚠️ 신뢰 경계(서버/데이터)가 없으면 `security-checklist` 는 붙이지 않는다.

## 0. 재사용 판단 (수정·유사 컴포넌트일 때만)
- 기존 것과 70%+ 유사하면 `_shared/reuse-vs-fork.md` 를 열어 **재사용 vs 조합 vs fork** 를 판단. 애매하면 **되묻는다**(사람 게이트).

## 1. 위치 & 이름 정하기
- 공용 프리미티브면 `app/components/ui/`, 특정 도메인 전용이면 `app/features/<도메인>/components/`. (`_shared/naming-and-structure.md`)

## 2. 테스트 먼저 (기계 게이트의 씨앗)
- `*.test.tsx` 로 **의도된 동작**(렌더·상호작용·접근성)을 먼저 쓴다(Testing Library).

## 3. 컴포넌트 개발
- props 타입 명시. **의미토큰만** 사용한 `*.module.scss`(`_shared/tokens-and-style.md`).
- 동작 분기 boolean 남발 금지(`_shared/reuse-vs-fork.md` 의 냄새 신호).

## 4. 스토리 작성 (사람 게이트 표면)
- `*.stories.tsx` — 주요 상태(기본·에러·로딩·엣지)를 스토리로. a11y 애드온 통과.

## 5. 게이트 (순서 고정)
1. **기계 게이트:** `pnpm typecheck && pnpm lint && pnpm test` + 스토리 렌더 OK → 실패면 사람 안 부르고 고침.
2. **사람 게이트:** Storybook에서 "의도대로 보이나?" 한 번 확인. (보이는 것만 사람)

## 6. 종료
- `feat:`(신규)/`refactor:`(수정) 커밋.

## 하지 말 것
- 하드코딩 색/간격(토큰 우회), 스토리 없는 컴포넌트(CI 차단), 기계 게이트 건너뛰고 사람부터 호출.
