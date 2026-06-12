# 맷 포콕: /diagnose

- 출처: https://github.com/mattpocock/skills
- 위치: `skills/engineering/diagnose/SKILL.md`
- 부속: `scripts/hitl-loop.template.sh` (Phase 1 최후 수단용 보조 스크립트)

어려운 버그를 위한 6단계 규율. "명시적 정당화 없이는 단계를 건너뛰지 마라."

## 원문 (SKILL.md)

````
---
name: diagnose
description: Disciplined diagnosis loop for hard bugs and performance regressions. Reproduce → minimise → hypothesise → instrument → fix → regression-test. Use when user says "diagnose this" / "debug this", reports a bug, says something is broken/throwing/failing, or describes a performance regression.
---

# Diagnose

A discipline for hard bugs. Skip phases only when explicitly justified.

When exploring the codebase, use the project's domain glossary to get a clear mental model of the relevant modules, and check ADRs in the area you're touching.

## Phase 1 — Build a feedback loop

**This is the skill.** Everything else is mechanical. If you have a fast, deterministic, agent-runnable pass/fail signal for the bug, you will find the cause — bisection, hypothesis-testing, and instrumentation all just consume that signal. If you don't have one, no amount of staring at code will save you.

Spend disproportionate effort here. **Be aggressive. Be creative. Refuse to give up.**

### Ways to construct one — try them in roughly this order

1. **Failing test** at whatever seam reaches the bug — unit, integration, e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) — drives the UI, asserts on DOM/console/network.
5. **Replay a captured trace.** Save a real network request / payload / event log to disk; replay it through the code path in isolation.
6. **Throwaway harness.** Spin up a minimal subset of the system (one service, mocked deps) that exercises the bug code path with a single function call.
7. **Property / fuzz loop.** If the bug is "sometimes wrong output", run 1000 random inputs and look for the failure mode.
8. **Bisection harness.** If the bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" so you can `git bisect run` it.
9. **Differential loop.** Run the same input through old-version vs new-version (or two configs) and diff outputs.
10. **HITL bash script.** Last resort. If a human must click, drive _them_ with `scripts/hitl-loop.template.sh` so the loop is still structured. Captured output feeds back to you.

Build the right feedback loop, and the bug is 90% fixed.

### Iterate on the loop itself

Treat the loop as a product. Once you have _a_ loop, ask:

- Can I make it faster? (Cache setup, skip unrelated init, narrow the test scope.)
- Can I make the signal sharper? (Assert on the specific symptom, not "didn't crash".)
- Can I make it more deterministic? (Pin time, seed RNG, isolate filesystem, freeze network.)

A 30-second flaky loop is barely better than no loop. A 2-second deterministic loop is a debugging superpower.

### Non-deterministic bugs

The goal is not a clean repro but a **higher reproduction rate**. Loop the trigger 100×, parallelise, add stress, narrow timing windows, inject sleeps. A 50%-flake bug is debuggable; 1% is not — keep raising the rate until it's debuggable.

### When you genuinely cannot build a loop

Stop and say so explicitly. List what you tried. Ask the user for: (a) access to whatever environment reproduces it, (b) a captured artifact (HAR file, log dump, core dump, screen recording with timestamps), or (c) permission to add temporary production instrumentation. Do **not** proceed to hypothesise without a loop.

Do not proceed to Phase 2 until you have a loop you believe in.

## Phase 2 — Reproduce

Run the loop. Watch the bug appear.

Confirm:

- [ ] The loop produces the failure mode the **user** described — not a different failure that happens to be nearby. Wrong bug = wrong fix.
- [ ] The failure is reproducible across multiple runs (or, for non-deterministic bugs, reproducible at a high enough rate to debug against).
- [ ] You have captured the exact symptom (error message, wrong output, slow timing) so later phases can verify the fix actually addresses it.

Do not proceed until you reproduce the bug.

## Phase 3 — Hypothesise

Generate **3–5 ranked hypotheses** before testing any of them. Single-hypothesis generation anchors on the first plausible idea.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

If you cannot state the prediction, the hypothesis is a vibe — discard or sharpen it.

**Show the ranked list to the user before testing.** They often have domain knowledge that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've already ruled out. Cheap checkpoint, big time saver. Don't block on it — proceed with your ranking if the user is AFK.

## Phase 4 — Instrument

Each probe must map to a specific prediction from Phase 3. **Change one variable at a time.**

Tool preference:

1. **Debugger / REPL inspection** if the env supports it. One breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses.
3. Never "log everything and grep".

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end becomes a single grep. Untagged logs survive; tagged logs die.

**Perf branch.** For performance regressions, logs are usually wrong. Instead: establish a baseline measurement (timing harness, `performance.now()`, profiler, query plan), then bisect. Measure first, fix second.

## Phase 5 — Fix + regression test

Write the regression test **before the fix** — but only if there is a **correct seam** for it.

A correct seam is one where the test exercises the **real bug pattern** as it occurs at the call site. If the only available seam is too shallow (single-caller test when the bug needs multiple callers, unit test that can't replicate the chain that triggered the bug), a regression test there gives false confidence.

**If no correct seam exists, that itself is the finding.** Note it. The codebase architecture is preventing the bug from being locked down. Flag this for the next phase.

If a correct seam exists:

1. Turn the minimised repro into a failing test at that seam.
2. Watch it fail.
3. Apply the fix.
4. Watch it pass.
5. Re-run the Phase 1 feedback loop against the original (un-minimised) scenario.

## Phase 6 — Cleanup + post-mortem

Required before declaring done:

- [ ] Original repro no longer reproduces (re-run the Phase 1 loop)
- [ ] Regression test passes (or absence of seam is documented)
- [ ] All `[DEBUG-...]` instrumentation removed (`grep` the prefix)
- [ ] Throwaway prototypes deleted (or moved to a clearly-marked debug location)
- [ ] The hypothesis that turned out correct is stated in the commit / PR message — so the next debugger learns

**Then ask: what would have prevented this bug?** If the answer involves architectural change (no good test seam, tangled callers, hidden coupling) hand off to the `/improve-codebase-architecture` skill with the specifics. Make the recommendation **after** the fix is in, not before — you have more information now than when you started.
````

## 원문 해석본 (SKILL.md)

````
---
name: diagnose
description: 어려운 버그와 성능 회귀를 위한 규율 있는 진단 루프. 재현 → 최소화 → 가설 → 계측 → 수정 → 회귀 테스트. 사용자가 "diagnose this"/"debug this"라고 하거나, 버그를 신고하거나, 뭔가 깨졌다/throw한다/실패한다고 말하거나, 성능 회귀를 묘사할 때 사용한다.
---

# Diagnose

어려운 버그를 위한 규율. 명시적으로 정당화될 때만 단계를 건너뛰어라.

코드베이스를 탐색할 때, 프로젝트의 도메인 용어집을 써서 관련 모듈에 대한 명확한 멘탈 모델을 얻고, 건드리는 영역의 ADR을 확인하라.

## Phase 1 — 피드백 루프를 구축하라

**이것이 곧 스킬이다.** 나머지는 전부 기계적이다. 버그에 대해 빠르고·결정론적이며·에이전트가 실행 가능한 pass/fail 신호가 있으면, 너는 원인을 찾아낸다 — 이분 탐색(bisection), 가설 검증, 계측은 전부 그 신호를 소비할 뿐이다. 그게 없으면, 아무리 코드를 노려봐도 소용없다.

여기에 불균형하게 많은 노력을 쏟아라. **공격적으로. 창의적으로. 포기하지 마라.**

### 루프를 만드는 방법 — 대략 이 순서로 시도하라

1. **실패하는 테스트** — 버그에 닿는 아무 seam에서든(unit, integration, e2e).
2. **Curl / HTTP 스크립트** — 돌고 있는 dev 서버 대상.
3. **CLI 호출** — fixture 입력으로, stdout을 known-good 스냅샷과 diff.
4. **헤드리스 브라우저 스크립트**(Playwright / Puppeteer) — UI를 구동하고 DOM/콘솔/네트워크에 단언.
5. **캡처한 트레이스 재생.** 실제 네트워크 요청/페이로드/이벤트 로그를 디스크에 저장하고, 그 코드 경로를 격리해 재생.
6. **일회용 하네스.** 시스템의 최소 부분집합(서비스 하나, mock된 의존성)을 띄워 버그 코드 경로를 함수 호출 하나로 실행.
7. **Property / fuzz 루프.** 버그가 "가끔 잘못된 출력"이면, 1000개의 랜덤 입력을 돌려 실패 모드를 찾아라.
8. **이분 탐색 하네스.** 버그가 알려진 두 상태(커밋, 데이터셋, 버전) 사이에서 생겼다면, "상태 X에서 부팅, 확인, 반복"을 자동화해 `git bisect run`으로 돌려라.
9. **차분(differential) 루프.** 같은 입력을 구버전 vs 신버전(또는 두 설정)에 통과시키고 출력을 diff.
10. **HITL bash 스크립트.** 최후의 수단. 사람이 클릭해야 한다면, `scripts/hitl-loop.template.sh`로 *그들을* 구동해 루프를 여전히 구조화하라. 캡처된 출력이 너에게 되먹임된다.

올바른 피드백 루프를 만들면, 버그는 90% 고쳐진 것이다.

### 루프 자체를 개선하라

루프를 제품처럼 다뤄라. 일단 *어떤* 루프가 생기면 물어라:

- 더 빠르게 할 수 있나? (셋업 캐시, 무관한 초기화 건너뛰기, 테스트 범위 좁히기.)
- 신호를 더 날카롭게 할 수 있나? ("크래시 안 남"이 아니라 구체적 증상에 단언.)
- 더 결정론적으로 할 수 있나? (시간 고정, RNG 시드, 파일시스템 격리, 네트워크 동결.)

30초짜리 깜빡이는(flaky) 루프는 없는 것보다 겨우 나을 뿐이다. 2초짜리 결정론적 루프는 디버깅 초능력이다.

### 비결정론적 버그

목표는 깨끗한 재현이 아니라 **더 높은 재현율**이다. 트리거를 100× 반복하고, 병렬화하고, 부하를 주고, 타이밍 창을 좁히고, sleep을 주입하라. 50% 깜빡 버그는 디버깅 가능하지만 1%는 아니다 — 디버깅 가능해질 때까지 비율을 계속 올려라.

### 정말로 루프를 만들 수 없을 때

멈추고 명시적으로 그렇게 말하라. 시도한 것을 나열하라. 사용자에게 요청하라: (a) 그것이 재현되는 환경 접근권, (b) 캡처된 아티팩트(HAR 파일, 로그 덤프, 코어 덤프, 타임스탬프 있는 화면 녹화), 또는 (c) 임시 프로덕션 계측 추가 허가. 루프 없이 가설 단계로 진행하지 **마라.**

믿을 만한 루프를 갖기 전까지 Phase 2로 진행하지 마라.

## Phase 2 — 재현(Reproduce)

루프를 돌려라. 버그가 나타나는 것을 지켜봐라.

확인:

- [ ] 루프가 **사용자**가 묘사한 실패 모드를 만들어낸다 — 근처에서 우연히 일어나는 다른 실패가 아니라. 잘못된 버그 = 잘못된 수정.
- [ ] 실패가 여러 번 실행에서 재현된다(비결정론적 버그라면, 디버깅하기 충분한 비율로 재현).
- [ ] 정확한 증상(에러 메시지, 잘못된 출력, 느린 타이밍)을 캡처해 두어, 이후 단계가 수정이 실제로 그것을 해결하는지 검증할 수 있게 했다.

버그를 재현하기 전까지 진행하지 마라.

## Phase 3 — 가설(Hypothesise)

어느 하나를 테스트하기 전에 **순위를 매긴 3~5개의 가설**을 생성하라. 단일 가설 생성은 처음 그럴듯한 아이디어에 고착된다.

각 가설은 **반증 가능(falsifiable)**해야 한다: 그것이 만드는 예측을 진술하라.

> 형식: "만약 <X>가 원인이면, <Y를 바꾸면> 버그가 사라진다 / <Z를 바꾸면> 더 나빠진다."

예측을 진술할 수 없다면, 그 가설은 감(vibe)이다 — 버리거나 날카롭게 하라.

**테스트 전에 순위 목록을 사용자에게 보여줘라.** 그들은 종종 즉시 재정렬해 주는 도메인 지식을 갖고 있거나("방금 #3에 변경을 배포했다"), 이미 배제한 가설을 안다. 값싼 체크포인트, 큰 시간 절약. 단 막지는 마라 — 사용자가 자리에 없으면(AFK) 너의 순위로 진행하라.

## Phase 4 — 계측(Instrument)

각 프로브는 Phase 3의 특정 예측에 매핑되어야 한다. **한 번에 한 변수만 바꿔라.**

도구 선호:

1. 환경이 지원하면 **디버거 / REPL 검사.** 브레이크포인트 하나가 로그 열 개를 이긴다.
2. 가설들을 구분하는 경계에 **타깃 로그.**
3. 절대 "전부 로그 찍고 grep" 하지 마라.

**모든 디버그 로그에 고유 prefix를 태깅하라**, 예: `[DEBUG-a4f2]`. 마지막 청소가 grep 한 번이 된다. 태깅 안 된 로그는 살아남고, 태깅된 로그는 죽는다.

**성능 분기(Perf branch).** 성능 회귀에서는 로그가 대개 틀린다. 대신: 베이스라인 측정(타이밍 하네스, `performance.now()`, 프로파일러, 쿼리 플랜)을 세우고 나서 이분 탐색하라. 측정 먼저, 수정 나중.

## Phase 5 — 수정 + 회귀 테스트

회귀 테스트를 **수정 전에** 써라 — 단 그것을 위한 **올바른 seam**이 있을 때만.

올바른 seam이란 테스트가 호출 지점에서 발생하는 그대로의 **실제 버그 패턴**을 실행하는 곳이다. 유일하게 가능한 seam이 너무 얕다면(버그가 여러 호출자를 필요로 하는데 단일 호출자 테스트, 버그를 유발한 연쇄를 복제할 수 없는 유닛 테스트), 거기에 둔 회귀 테스트는 거짓 확신을 준다.

**올바른 seam이 없다면, 그것 자체가 발견이다.** 기록하라. 코드베이스 아키텍처가 버그를 잠그는 것을 막고 있다. 다음 단계를 위해 이를 플래그하라.

올바른 seam이 있다면:

1. 최소화한 재현을 그 seam에서 실패하는 테스트로 바꾼다.
2. 실패를 지켜본다.
3. 수정을 적용한다.
4. 통과를 지켜본다.
5. Phase 1 피드백 루프를 원래의(최소화하지 않은) 시나리오에 대해 다시 돌린다.

## Phase 6 — 청소 + 사후 분석

완료 선언 전에 필수:

- [ ] 원래 재현이 더 이상 재현되지 않는다(Phase 1 루프 재실행)
- [ ] 회귀 테스트가 통과한다(또는 seam 부재가 문서화됨)
- [ ] 모든 `[DEBUG-...]` 계측이 제거됨(prefix를 `grep`)
- [ ] 일회용 프로토타입이 삭제됨(또는 명확히 표시된 디버그 위치로 이동)
- [ ] 옳았던 가설이 커밋/PR 메시지에 진술됨 — 다음 디버거가 배우도록

**그다음 물어라: 무엇이 이 버그를 막을 수 있었나?** 답이 아키텍처 변경을 수반하면(좋은 테스트 seam 없음, 얽힌 호출자, 숨은 결합) 구체적 내용과 함께 `/improve-codebase-architecture` 스킬로 넘겨라. 권고는 수정이 들어간 **후에** 하라, 전이 아니라 — 시작할 때보다 지금 정보가 더 많다.
````

## 해석·분석

- **Phase 1이 곧 스킬의 본질:** "이것이 곧 스킬이다. 나머지는 전부 기계적이다." 빠르고·결정론적·에이전트 실행 가능한 pass/fail 신호만 있으면 원인을 반드시 찾는다. 루프 구축 방법 10가지를 우선순위 순으로 제시.
- **"루프 자체를 제품처럼":** 더 빠르게/신호 더 날카롭게/더 결정론적으로. "30초 깜빡 루프는 없는 거나 다름없고, 2초 결정론적 루프는 디버깅 초능력."
- **비결정론적 버그:** 깨끗한 재현이 아니라 **재현율 올리기**. 1%는 불가능, 가능해질 때까지 올려라.
- **Phase 2:** 사용자가 묘사한 **바로 그** 실패 모드 재현(근처 다른 버그 금지 — "잘못된 버그 = 잘못된 수정").
- **Phase 3:** **3~5개 순위 가설** 먼저(단일 가설은 첫 아이디어에 고착). 각 가설 **반증 가능**해야 함. 예측 못 세우면 "vibe(감)" → 버려라. 사용자에게 리스트 제시(단 AFK면 블록 없이 진행).
- **Phase 4:** 프로브는 예측에 매핑, **한 번에 한 변수**. 디버거 > 타겟 로그 > "전부 로그+grep"(금지). 로그에 **고유 prefix 태그**(`[DEBUG-a4f2]`) → 마지막 grep 한 번 청소. 성능 회귀는 **측정 먼저**.
- **Phase 5:** 수정 **전** 회귀 테스트 — **올바른 seam이 있을 때만**. **"올바른 seam이 없다는 것 자체가 발견"**(아키텍처가 버그 잠금을 막고 있다는 신호).
- **Phase 6:** 청소 + **맞은 가설을 커밋/PR에 기록**(다음 디버거가 배우도록). 마지막에 "무엇이 이 버그를 막을 수 있었나?" → 아키텍처 문제면 `/improve-codebase-architecture`로 핸드오프(**수정 후**에 권고).

## 트리거 조건

"diagnose this" / "debug this", 버그 신고, 뭔가 깨졌다/throw한다/실패한다고 말할 때, 성능 회귀를 묘사할 때.
