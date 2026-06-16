# 공유: 브랜치 · 커밋 · 커밋 전 절차

## 브랜치
`<type>/<scope>-<요약>` — 소문자 kebab, **1브랜치 = 1작업 = 1PR**.
```
feat/auth-login   fix/profile-avatar-null-crash   refactor/button-variants
docs/spec-checkout   workflow/add-refactor-doc
```

## 커밋 (Conventional Commits — commitlint 강제)
형식: `<type>(<scope>): <제목>` + 빈 줄 + 본문(왜) + 푸터.
**언어 규약: 타입/스코프는 영어, 제목·본문은 한글.**
```
feat(auth): 이메일·비밀번호 로그인 추가

세션은 httpOnly 쿠키로 보관, 비번은 argon2id 해시.

Refs #12
```
허용 타입: `feat fix refactor docs test chore style perf ci build revert`.
제목: 명령형, 마침표 금지, 72자 이내 권장.

## 커밋 전 절차 (husky가 강제 — 계층)
| 시점 | 훅 | 검사 | 실패 시 |
|---|---|---|---|
| `git commit` | pre-commit | lint-staged(변경 파일 eslint --fix + prettier) | 못 고치는 lint → **커밋 차단** |
| `git commit` | commit-msg | commitlint 형식 검증 | 형식 위반 → **커밋 차단** |
| `git push` | pre-push | `pnpm typecheck && pnpm test` | 실패 → **푸시 차단** |
| PR | **CI(우회 불가)** | typecheck·lint·format·test·build·e2e·migrate·docs | 실패 → **머지 차단** |

### 알아둘 것
- 전체 테스트 강제는 **pre-push·CI**(매 커밋 전체 테스트는 느려 우회 유발).
- `--no-verify`로 로컬 훅은 뚫려도 **CI는 못 뚫는다.** 진짜 보증 = CI + 브랜치 보호(필수 체크).
