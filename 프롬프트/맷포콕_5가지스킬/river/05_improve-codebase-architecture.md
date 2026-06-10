# 5. improve-codebase-architecture — 아키텍처 개선

- 출처: [github.com/mattpocock/skills](https://github.com/mattpocock/skills) · `skills/engineering/improve-codebase-architecture/SKILL.md`
- 워크플로우 위치: **5단계** (구조 개선)

---

## 원문 (Original)

```markdown
---
name: improve-codebase-architecture
description: Find deepening opportunities in a codebase, informed by the domain language in CONTEXT.md and the decisions in docs/adr/. Use when the user wants to improve architecture, find refactoring opportunities, consolidate tightly-coupled modules, or make a codebase more testable and AI-navigable.
---

# Improve Codebase Architecture

Surface architectural friction and propose deepening opportunities — refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

## Glossary
Use these terms exactly in every suggestion.
- Module — anything with an interface and an implementation.
- Interface — everything a caller must know to use the module: types, invariants, error modes, ordering, config.
- Implementation — the code inside.
- Depth — leverage at the interface: a lot of behaviour behind a small interface. Deep = high leverage. Shallow = interface nearly as complex as the implementation.
- Seam — where an interface lives; a place behaviour can be altered without editing in place.
- Adapter — a concrete thing satisfying an interface at a seam.
- Leverage — what callers get from depth.
- Locality — what maintainers get from depth: change, bugs, knowledge concentrated in one place.

Key principles:
- Deletion test: imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- The interface is the test surface.
- One adapter = hypothetical seam. Two adapters = real seam.

## Process
### 1. Explore
Read the domain glossary and ADRs first. Then use the Explore subagent to walk the codebase. Note friction: bouncing between many small modules; shallow modules; pure functions extracted just for testability but real bugs hide in how they're called; tightly-coupled modules leaking across seams; untested/hard-to-test parts.
Apply the deletion test to anything suspected shallow.

### 2. Present candidates
Numbered list of deepening opportunities. For each: Files, Problem, Solution (plain English), Benefits (in terms of locality and leverage, and how tests improve).
Use CONTEXT.md vocabulary for domain, glossary vocabulary for architecture.
ADR conflicts: surface only when friction warrants revisiting. Don't propose interfaces yet. Ask which to explore.

### 3. Grilling loop
Once user picks a candidate, drop into a grilling conversation. Walk the design tree — constraints, dependencies, shape of the deepened module, what sits behind the seam, what tests survive.
Side effects inline: add new concepts to CONTEXT.md; sharpen fuzzy terms; offer an ADR when a candidate is rejected with a load-bearing reason.
```

---

## 번역 (Translation)

```markdown
# 코드베이스 아키텍처 개선

아키텍처적 마찰을 드러내고 "심화 기회(deepening opportunities)"를 제안한다 — 얕은 모듈을 깊은 모듈로 바꾸는 리팩터. 목표는 테스트 가능성과 AI 탐색 가능성이다.

## 용어집
모든 제안에서 이 용어들을 정확히 사용하라.
- 모듈(Module) — 인터페이스와 구현을 가진 모든 것.
- 인터페이스(Interface) — 호출자가 모듈을 쓰기 위해 알아야 할 모든 것: 타입, 불변식, 에러 모드, 순서, 설정. (단순 타입 시그니처가 아님)
- 구현(Implementation) — 내부의 코드.
- 깊이(Depth) — 인터페이스에서의 지렛대: 작은 인터페이스 뒤에 많은 행위. 깊다 = 높은 지렛대. 얕다 = 인터페이스가 구현만큼이나 복잡함.
- 솔기(Seam) — 인터페이스가 사는 곳; 코드를 직접 고치지 않고 행위를 바꿀 수 있는 지점. ("경계(boundary)" 대신 이 말을 쓸 것)
- 어댑터(Adapter) — 솔기에서 인터페이스를 충족하는 구체적인 것.
- 지렛대(Leverage) — 호출자가 깊이에서 얻는 것.
- 지역성(Locality) — 유지보수자가 깊이에서 얻는 것: 변경·버그·지식이 한 곳에 집중됨.

핵심 원칙:
- 삭제 테스트: 모듈을 삭제한다고 상상하라. 복잡성이 사라지면 그건 그냥 통과 지점이었다. 복잡성이 N개의 호출자에 걸쳐 다시 나타나면, 그건 제 몫을 하고 있던 것이다.
- 인터페이스가 곧 테스트 표면이다.
- 어댑터 하나 = 가상의 솔기. 어댑터 둘 = 진짜 솔기.

## 프로세스
### 1. 탐색
도메인 용어집과 ADR을 먼저 읽는다. 그 다음 Explore 서브에이전트로 코드베이스를 훑는다. 마찰을 기록한다: 작은 모듈 사이를 계속 오가야 이해되는 곳; 얕은 모듈; 테스트만을 위해 추출됐지만 진짜 버그는 호출 방식에 숨은 순수 함수; 솔기를 넘어 새는 강결합 모듈; 테스트 안 됐거나 테스트하기 어려운 부분.
얕다고 의심되는 것에 삭제 테스트를 적용한다.

### 2. 후보 제시
심화 기회를 번호 목록으로. 각 항목: 파일, 문제, 해결(평이한 표현), 이점(지역성·지렛대 관점, 그리고 테스트가 어떻게 나아지는지).
도메인은 CONTEXT.md 용어로, 아키텍처는 용어집 용어로.
ADR 충돌: 다시 들여다볼 만큼 마찰이 클 때만 드러낸다. 아직 인터페이스를 제안하지 말 것. 무엇을 탐구할지 물어라.

### 3. 그릴링 루프
사용자가 후보를 고르면, 그릴링 대화로 들어간다. 설계 트리를 함께 걷는다 — 제약, 의존성, 깊어진 모듈의 형태, 솔기 뒤에 무엇이 있는지, 어떤 테스트가 살아남는지.
부수효과는 결정이 굳어질 때 인라인으로: 새 개념을 CONTEXT.md에 추가; 모호한 용어를 날카롭게; 후보가 "근거 있는 이유"로 거절되면 ADR을 제안.
```

---

## 해설

### 핵심 1 — "깊은 모듈" 사상의 집대성
[`to-prd`](02_to-prd.md), [`tdd`](04_tdd.md)에서 부분적으로 언급된 **깊은/얕은 모듈** 개념을 본격적으로 다루는 스킬. 존 오스터하우트 *A Philosophy of Software Design*의 사상을 코드베이스 리뷰 도구로 구현.

- **깊은 모듈**: 작은 인터페이스 뒤에 많은 행위 → 높은 지렛대(leverage)
- **얕은 모듈**: 인터페이스가 구현만큼 복잡 → 만들 가치가 의심됨

### 핵심 2 — 삭제 테스트 (Deletion test)
얕은 모듈을 판별하는 실용 도구.
> "이 모듈을 삭제한다고 상상하라. 복잡성이 그냥 사라지면 통과 지점이었다(=얕음). 복잡성이 여러 호출자에 걸쳐 다시 나타나면 제 몫을 하고 있던 것이다(=깊음)."

### 핵심 3 — 엄격한 전용 용어 강제
"component / service / API / boundary 같은 말로 흘러가지 말라." 모듈·인터페이스·솔기·어댑터·지렛대·지역성 — **정해진 용어만** 쓰게 강제. 지난 스터디 교훈 "명시적 원칙이 암묵적 원칙보다 일관성이 높다"의 강한 사례.

### 핵심 4 — 다른 스킬을 내부에서 재사용
- 3단계가 **"grilling loop"** — 즉 [`grill-me`](01_grill-me.md)를 이 스킬 안에서 다시 호출. 스킬이 스킬을 부르는 **합성(composition)** 구조.
- `CONTEXT.md`(도메인 언어), `docs/adr/`(아키텍처 결정 기록), Explore 서브에이전트 등 외부 컨텍스트와 적극 연동.

### "AI 탐색 가능성(AI-navigability)"이라는 목표
주목할 점: 리팩터의 목표를 단순 "깔끔함"이 아니라 **테스트 가능성 + AI가 코드를 잘 돌아다닐 수 있는가**로 명시. 깊은 모듈은 AI 에이전트가 적은 인터페이스만 이해하면 되므로 자동화에 유리.

### 워크플로우 마무리
5단계로 구조를 개선하면서 발견된 새 작업은 다시 [`grill-me`](01_grill-me.md) → [`to-prd`](02_to-prd.md) → ... 로 순환. **닫힌 루프**를 이룹니다.
