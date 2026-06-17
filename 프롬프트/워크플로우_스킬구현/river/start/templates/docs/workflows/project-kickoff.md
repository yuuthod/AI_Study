# 워크플로우: 프로젝트 킥오프 (project-kickoff) — 1회성 "두 번째 스텝"

> init(start.md) 직후, 제품 전체의 **기획·데이터모델·디자인토큰을 처음 채우는** 절차.
> 결과물은 전부 `docs/README.md` 지도가 정한 자리에 꽂는다. 이후 개별 기능은 `feature-build`로.
> @참조: `docs/README.md`(지도) · (있으면) 스킬 `office-hours`·`brainstorming`·`grill-me`·`to-prd`

## 0. 성숙도 판별
사용자가 가져온 게 어느 단계인지 먼저 가른다. **확신 없으면 되묻는다.**

## 경로 ① 아이디어만 (기획 미완)
1. **발산→수렴:** 스킬 있으면 `office-hours`/`brainstorming`으로 문제·사용자·범위 탐색. 없으면 구조화 Q&A.
2. **압박·구체화:** `grill-me`(있으면)로 모호한 곳을 합의 가능한 수준까지.
3. **문서화:** `docs/product/overview.md` 채우고, 기능별 `docs/specs/<기능>.md`(`_template`), 필요하면 `docs/data-model/`. (`to-prd` 있으면 활용)
4. **디자인 없음:** `design-foundation.md`를 **중립 임시값 모드**로 1회 실행(토큰 임시값 + 글로벌 + 에센셜 프리미티브 구조). 시각 게이트는 "동작" 중심, 비주얼 폴리시는 디자인 확정 후 `design-foundation` 리테마링.
5. → spec이 "개발 가능 수준"이면 `feature-build`.

## 경로 ② 기획만 (디자인 없음)
1. **정규화:** 받은 기획을 `docs/product/overview.md` + `docs/specs/*` 양식으로 정리.
2. **빈칸 보완:** `grill-me`(있으면)로 모호한 수용기준만 메운다.
3. **데이터:** `docs/data-model/*` 작성 → `prisma/schema.prisma` 반영 → `migrate dev`.
4. **디자인 없음:** `design-foundation.md` 중립 임시값 모드(①과 동일).
5. → `feature-build`.

## 경로 ③ 기획 + 디자인 모두
1. **가볍게 확인:** 적합성·범위만 점검(이미 spec 존재 → `docs/specs/*`로 정리). 화면정의서는 `docs/screens/*`.
2. **디자인 파운데이션:** `design-foundation.md`를 **실값 모드**로 실행 — 확정 색/폰트/간격을 `tokens.css`에 실값 주입 + 글로벌 + 에센셜 프리미티브 + 경량 게이트.
3. → `feature-build` 풀 루프. 시각 게이트가 **시안 대비로 진짜 작동.**

## 공통 종료
- 세 경로 모두 산출물을 `docs/` 지도 위치에 저장 → 커밋(`docs:`). 이후 기능 작업은 `feature-build`로 합류.

## 하지 말 것
- 기본 정의(`product/overview.md`) 없이 기능부터 빌드, 문서를 지도 밖 임의 위치에 생성.
