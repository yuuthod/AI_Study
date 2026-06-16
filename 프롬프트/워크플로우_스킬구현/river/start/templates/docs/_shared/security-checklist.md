# 공유: 신뢰 경계 보안 체크리스트 (route/server 작업 전용)

> loader·action·서버 함수에서 **빠짐없이** 통과. 이건 부탁이 아니라 체크 항목이다(상당수는 lint/타입이 함께 강제).

## 입력 (신뢰 불가)
- [ ] formData·params·search·외부응답을 **Zod로 파싱** 후 사용(raw 접근 금지).
- [ ] 숫자/ID/열거형 범위·형식 검증. 빈 값·과대 입력 방어.

## 인증 / 인가
- [ ] 보호 자원은 loader/action **맨 앞에서 세션 검증**.
- [ ] **인가(권한) 확인**: 이 사용자가 *이 객체*에 접근 가능한가(IDOR 방지 — 소유권 체크).
- [ ] 실패 시 동일한 일반 메시지(존재 여부 노출 금지).

## 시크릿 / 서버 격리
- [ ] 시크릿·DB·외부 키는 **`*.server.ts`** 에만. 클라 import 경로에 없음(lint가 차단).
- [ ] 응답/에러에 스택·쿼리·내부 경로 노출 안 함.

## 변경 / 통신
- [ ] 뮤테이션(POST/PUT/DELETE)은 **CSRF 토큰 검증**.
- [ ] DB는 Prisma 파라미터 바인딩만(원시 SQL 문자열 연결 금지).
- [ ] 외부 호출은 `app/lib/http.server.ts` 경유(타임아웃·에러·응답 검증 일원화).
- [ ] 인증/민감 action은 **레이트 리밋** 적용.

## 쿠키 / 세션
- [ ] `httpOnly` 항상, `sameSite=lax`, `secure`는 `NODE_ENV==="production"` 조건부.
- [ ] 토큰을 `localStorage`/`document.cookie` 에 절대 저장 안 함(lint 차단).
