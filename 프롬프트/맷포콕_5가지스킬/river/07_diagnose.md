# 7. diagnose — 막혔을 때 디버깅 (분기 스킬)

- 출처: [github.com/mattpocock/skills](https://github.com/mattpocock/skills) · `skills/engineering/diagnose/SKILL.md`
- 워크플로우 위치: **분기(branch)** — 선형 단계가 아니라 "구현 중 막혔을 때" 들어가는 우회로
- 영상 라인업에서는 4번(검증) 자리를 차지

> **왜 이 파일이 따로 있나?** 이 스터디는 "5가지 스킬"을 다루지만, 출처에 따라 5번째가 `to-issues`이기도 `diagnose`이기도 합니다. 둘 다 실제 맷 포콕 스킬이라 6개 모두 정리합니다. 차이의 이유는 [08_라인업차이.md](08_라인업차이.md) 참고.

---

## 원문 (Original) — 발췌

```markdown
---
name: diagnose
description: Disciplined diagnosis loop for hard bugs and performance regressions. Reproduce → minimise → hypothesise → instrument → fix → regression-test.
---

# Diagnose
A discipline for hard bugs. Skip phases only when explicitly justified.

## Phase 1 — Build a feedback loop
This is the skill. Everything else is mechanical. If you have a fast, deterministic, agent-runnable pass/fail signal for the bug, you will find the cause. If you don't, no amount of staring at code will save you.
Be aggressive. Be creative. Refuse to give up.
(Ways to construct one, in order: failing test → curl/HTTP → CLI+fixture → headless browser → replay trace → throwaway harness → property/fuzz → bisection → differential → HITL bash script.)
Build the right feedback loop, and the bug is 90% fixed.

## Phase 2 — Reproduce
Run the loop. Watch the bug appear. Confirm it's the failure the USER described, not a nearby one. Wrong bug = wrong fix.

## Phase 3 — Hypothesise
Generate 3–5 ranked hypotheses before testing any. Each must be falsifiable:
"If <X> is the cause, then <changing Y> will make the bug disappear."
Show the ranked list to the user before testing.

## Phase 4 — Instrument
Each probe maps to a specific prediction. Change one variable at a time.
Debugger/REPL > targeted logs > never "log everything and grep".
Tag every debug log with a unique prefix e.g. [DEBUG-a4f2] for one-grep cleanup.

## Phase 5 — Fix + regression test
Write the regression test BEFORE the fix — but only if a correct seam exists.
If no correct seam exists, that itself is the finding (architecture is preventing lockdown).

## Phase 6 — Cleanup + post-mortem
Original repro gone, regression test passes, all [DEBUG-...] removed, correct hypothesis stated in commit.
Then ask: what would have prevented this bug? If architectural, hand off to /improve-codebase-architecture.
```

---

## 번역 (Translation) — 핵심

```markdown
# Diagnose (진단)
어려운 버그를 위한 규율. 명시적으로 정당화될 때만 단계를 건너뛴다.

## 1단계 — 피드백 루프를 만들어라
이것이 스킬의 전부다. 나머지는 다 기계적이다. 버그에 대한 빠르고·결정론적이고·에이전트가 돌릴 수 있는 통과/실패 신호가 있으면, 원인은 반드시 찾는다. 그게 없으면 코드를 아무리 노려봐도 소용없다.
공격적으로. 창의적으로. 포기하지 마라.
(만드는 방법 순서: 실패 테스트 → curl/HTTP → CLI+픽스처 → 헤드리스 브라우저 → 트레이스 재생 → 임시 하네스 → 프로퍼티/퍼즈 → 이분 탐색 → 차분 비교 → 최후수단 HITL 스크립트)
올바른 피드백 루프를 만들면 버그는 90% 해결된 것이다.

## 2단계 — 재현하라
루프를 돌려 버그가 나타나는 걸 본다. "사용자가 말한" 그 실패인지 확인 — 근처의 다른 실패면 안 된다. 틀린 버그 = 틀린 수정.

## 3단계 — 가설을 세워라
테스트 전에 3~5개의 순위 매긴 가설을 만든다. 각각 반증 가능해야 한다:
"X가 원인이면, Y를 바꾸면 버그가 사라질 것이다."
테스트 전에 사용자에게 순위 목록을 보여줘라. (도메인 지식으로 즉시 재정렬되곤 한다)

## 4단계 — 계측하라
각 탐침은 특정 예측에 대응. 한 번에 한 변수만 바꾼다.
디버거/REPL > 타깃 로그 > "다 찍고 grep" 절대 금지.
모든 디버그 로그에 [DEBUG-a4f2] 같은 고유 접두사 → 정리는 grep 한 번으로.

## 5단계 — 수정 + 회귀 테스트
수정 "전에" 회귀 테스트를 쓴다 — 단, 올바른 솔기가 있을 때만.
올바른 솔기가 없으면, 그 자체가 발견이다 (아키텍처가 버그 봉쇄를 막고 있음).

## 6단계 — 정리 + 사후분석
원래 재현이 사라졌나, 회귀 테스트 통과하나, 모든 [DEBUG-...] 제거됐나, 맞은 가설을 커밋 메시지에 적었나.
그리고 묻는다: 무엇이 이 버그를 막았을까? 아키텍처 문제면 /improve-codebase-architecture로 넘긴다.
```

---

## 해설

### 핵심 — "피드백 루프가 곧 스킬이다"
당신의 영상 노트와 정확히 일치하는 지점: **"그냥 물어보면 추측만 반복한다. 반드시 [재현, 가설, 확인, 진단] 단계를 거친다."**
diagnose의 1단계 선언이 이를 못박습니다 — **"This is the skill. Everything else is mechanical."** 빠르고 결정론적인 통과/실패 신호(피드백 루프)만 만들면 버그는 90% 해결. [`tdd`](04_tdd.md)의 "피드백 루프가 중요하다"와 같은 사상.

### grill-me 패턴의 재등장
3단계에서 **3~5개의 순위 매긴 가설을 사용자에게 보여주고** 도메인 지식으로 재정렬받는 흐름은, [`grill-me`](01_grill-me.md)의 "추천을 제시하고 사용자와 합의" 패턴과 동일.

### improve-architecture로의 연결
6단계 마지막: 버그의 근본 원인이 아키텍처면 [`improve-codebase-architecture`](05_improve-codebase-architecture.md)로 핸드오프. 5단계에서도 "올바른 솔기가 없으면 그 자체가 아키텍처 발견"이라며 두 스킬을 연결. → diagnose는 독립된 섬이 아니라 **워크플로우에 물려 있는 분기**.

### to-issues와의 본질적 차이
| | to-issues | diagnose |
|---|-----------|----------|
| 언제 | 항상 (PRD 다음 필수 단계) | 막혔을 때만 (조건부) |
| 방향 | 앞으로 (계획 → 작업) | 멈춤 해소 (버그 → 원인) |
| 파이프라인 | 선형 본류 | 우회 분기 |

이 차이가 "왜 5개 라인업이 갈리는가"의 핵심입니다 → [08_라인차이.md](08_라인업차이.md)
