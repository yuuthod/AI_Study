# start 번들 — 하네스 기반 프로젝트 초기 설치 키트

기획·디자인을 마친 뒤, **질문 없이 한 번에** "당장 실무 개발이 가능한" 풀스택 프로젝트를 세팅하는 재사용 키트.
React Router v7 풀스택 + 백엔드 보안 + 하네스 엔지니어링(라우터+워크플로우+센서)을 기본 탑재.

## 쓰는 법
1. 새 빈 폴더(또는 `git init`된 폴더)에 이 **`start/` 폴더를 통째로 복사**한다.
2. 그 폴더에서 AI 에이전트를 켜고: **"start/start.md 기반으로 프로젝트 생성해줘."**
3. 에이전트가 `start.md` 의 Phase 0→8을 질문 없이 실행한다.
   - Phase 0(Preflight)에서 **필요 도구를 먼저 모두 점검·정비**한다(여기가 유일한 멈춤 지점).
   - Phase 7에서 타입·lint·테스트·빌드를 **전부 통과**시킨다.
   - Phase 8에서 **`start/` 번들을 삭제**하고 **init 커밋**을 찍는다.

## 끝나면
- `pnpm dev` 로 개발 시작. `start/` 흔적 없음, 깨끗한 트리 + 커밋 1개.
- 이후 모든 작업은 루트 `CLAUDE.md`(라우터)가 `docs/workflows/<작업>.md` 하나로 안내.

## 구조
```
start/
  start.md                    # 마스터 오케스트레이터(에이전트 지시서)
  README.md                   # 이 파일
  templates/
    CLAUDE.md                 # 라우터 + 불변 규칙(프로젝트 루트로)
    docs/workflows/           # 작업별 워크플로우 5개(린-코어)
    docs/_shared/             # 공유 프래그먼트 5개(필요시 @참조)
    config/                   # 센서: eslint·tsconfig·husky·commitlint·CI·prisma·docker 등
    reference/                # 보안 코드 스니펫(Phase 5가 그대로 생성)
```

## 확정 스택(요약)
RR7(풀스택) · TS strict+ · pnpm · PostgreSQL+Prisma · 자체 세션쿠키+remix-auth+argon2id ·
Zod+Conform · Sass+CSS Modules+CSS변수토큰 · Storybook · Vitest+RTL+Playwright ·
ESLint+Prettier · husky+commitlint · GitHub Actions(우회 불가 벽) · 기능 기반 아키텍처.

> 다른 스택으로 재사용하려면 `start.md §확정 결정`과 `templates/config/*` 만 갈아끼우면 된다.
