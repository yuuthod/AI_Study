# 워크플로우: 라우트/서버 작업 (route-create)

> loader·action·인증·DB·외부 API = **신뢰 경계**. 이 프로젝트 보안의 핵심. 안 보이는 작업 → **기계 게이트가 곧 사람 게이트를 대신**한다.
> @참조: `_shared/security-checklist.md` (필수) · `_shared/gates.md` · `_shared/naming-and-structure.md`

## 1. 입력·출력 스키마 정의 (Zod)
- 이 라우트가 받는 모든 입력(formData·params·search·외부응답)의 **Zod 스키마**를 먼저 정의(`app/features/<도메인>/*.schema.ts`).
- **타입은 런타임에 사라진다.** 들어온 값은 반드시 `parse`/`safeParse` 후 사용.

## 2. 신뢰 경계 체크 (security-checklist 따름)
`_shared/security-checklist.md` 의 항목을 **빠짐없이** 통과:
- 입력 Zod 검증 ✓  인증/인가 가드(맨 앞) ✓  시크릿은 `*.server.ts` ✓
- 권한 객체 소유권 확인(IDOR 방지) ✓  에러 메시지에 내부정보 노출 금지 ✓
- 뮤테이션은 CSRF 토큰 검증 ✓  외부 호출은 `app/lib/http.server.ts` 경유 ✓

## 3. loader/action 구현
- 파일은 얇게: 검증 → 가드 → `features/<도메인>` 의 서버 함수 호출 → 결과 반환.
- DB는 Prisma로만(원시 SQL 금지 → 인젝션 차단). 외부 API는 서버에서만.

## 4. 테스트 (기계 게이트 = 여기선 주 게이트)
- action/loader 단위 테스트: **검증 실패·인증 실패·권한 실패·정상** 4케이스 최소.
- 핵심 흐름(로그인 등)은 Playwright E2E 1개.

## 5. 게이트 & 종료
- `pnpm typecheck && pnpm lint && pnpm test` 통과(서버 모듈 클라 유출 lint 포함).
- `feat:` 커밋 → PR → CI 통과.

## 하지 말 것
- 검증 없이 `formData.get()` 바로 사용, 시크릿을 클라 접근 코드에, 인가 누락, raw SQL 문자열 연결.
