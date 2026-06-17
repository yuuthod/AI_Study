# 공유: 디자인 토큰 · Sass 규약

## 2계층 토큰 (CSS 변수)
```css
/* app/styles/tokens.css */
:root {
  /* ① 원시 토큰 — 디자인 확정값을 여기 채움(슬롯) */
  --blue-500: #3b82f6;
  --gray-900: #111827;
  --font-sans: "Pretendard", system-ui, sans-serif;
  --space-2: 0.5rem;

  /* ② 의미 토큰 — 컴포넌트는 *이것만* 참조 */
  --color-bg: #ffffff;
  --color-text: var(--gray-900);
  --color-primary: var(--blue-500);
}
```

## 규칙
- **컴포넌트는 의미토큰(`--color-text` 등)만** 쓴다. 원시토큰·하드코딩 hex/px 직접 사용 금지.
- 색 변형이 필요하면 Sass `darken()` 대신 CSS `color-mix(in srgb, var(--color-primary), black 10%)`.
- Sass(`*.module.scss`)는 **믹스인·함수·미디어쿼리**에만. *값*은 토큰으로.
- 다크모드: 지금은 구조만(토큰 계층). 구현은 필요 시 래칫으로(`workflow-change`).

## 네이밍 규약
- 의미토큰: 카테고리 접두사 — `--color-*` `--space-*` `--font-*` `--radius-*` `--shadow-*` `--z-*` `--size-*`.
- 원시토큰: `--{색상}-{명도}` (`--blue-500`).
- **컴포넌트 토큰(`--button-*`)은 래칫:** 의미토큰으로 표현 안 되는 고유 동작/상태가 생길 때만 승격. 그 전엔 만들지 않는다.

## 토큰 파이프라인 (Figma → tokens.css)
- 현재: **수동 미러링**(Figma 진실 참조 → 사람이 `tokens.css` 입력).
- 래칫: 변경이 잦아지면 **Tokens Studio + Style Dictionary** 자동화로(`workflow-change`).
- 토큰 작성/변경은 `workflows/design-foundation.md` 절차로(게이트 포함). 토큰 파일 즉흥 직접수정 금지.

## 글로벌 (`app/styles/`)
- `global.scss`: modern-normalize + box-sizing + body(토큰) + 포커스 가시성 + `prefers-reduced-motion`.
- `mixins`: `focus-ring` · `media-*` · `visually-hidden` · `truncate`.

## 예시
```scss
/* LoginForm.module.scss */
.field {
  color: var(--color-text);
  padding: var(--space-2);
  @include focus-ring;   /* 믹스인 OK */
}
```
