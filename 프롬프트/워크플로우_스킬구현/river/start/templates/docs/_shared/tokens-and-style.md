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

## 예시
```scss
/* LoginForm.module.scss */
.field {
  color: var(--color-text);
  padding: var(--space-2);
  @include focus-ring;   /* 믹스인 OK */
}
```
