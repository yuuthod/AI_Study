# 맷 포콕: /grill-with-docs

- 출처: https://github.com/mattpocock/skills
- 위치: `skills/engineering/grill-with-docs/`
- 부속 파일: `CONTEXT-FORMAT.md`, `ADR-FORMAT.md`

`grill-me`의 상위 호환·엔지니어링 특화 버전. `<what-to-do>` 블록은 grill-me와 거의 동일(단 "각 질문마다 피드백을 기다린다" 명시)하고, `<supporting-info>`에서 **DDD(도메인 주도 설계) 도구**를 붙인다.

## 원문 (SKILL.md)

````
---
name: grill-with-docs
description: Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates documentation (CONTEXT.md, ADRs) inline as decisions crystallise. Use when user wants to stress-test a plan against their project's language and documented decisions.
---

<what-to-do>

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing.

If a question can be answered by exploring the codebase, explore the codebase instead.

</what-to-do>

<supporting-info>

## Domain awareness

During codebase exploration, also look for existing documentation:

### File structure

Most repos have a single context:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple contexts. The map points to where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create files lazily — only when you have something to write. If no `CONTEXT.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update CONTEXT.md inline

When a term is resolved, update `CONTEXT.md` right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

`CONTEXT.md` should be totally devoid of implementation details. Do not treat `CONTEXT.md` as a spec, a scratch pad, or a repository for implementation decisions. It is a glossary and nothing else.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).

</supporting-info>
````

## 원문 해석본 (SKILL.md)

````
---
name: grill-with-docs
description: 너의 계획을 기존 도메인 모델에 비추어 도전하고, 용어를 날카롭게 다듬으며, 결정이 구체화될 때마다 문서(CONTEXT.md, ADR)를 인라인으로 갱신하는 그릴링 세션. 사용자가 자기 프로젝트의 언어와 문서화된 결정에 비추어 계획을 stress-test하고 싶을 때 사용한다.
---

<what-to-do>

이 계획의 모든 측면에 대해 공유된 이해에 도달할 때까지 나를 끈질기게 인터뷰하라. 설계 트리의 각 가지를 따라 내려가며, 결정들 사이의 의존 관계를 하나씩 해소하라. 각 질문마다 너의 추천 답변을 함께 제시하라.

질문은 한 번에 하나씩 던지되, 다음으로 넘어가기 전에 각 질문에 대한 피드백을 기다려라.

코드베이스를 탐색해서 답할 수 있는 질문이라면, 대신 코드베이스를 탐색하라.

</what-to-do>

<supporting-info>

## 도메인 인식

코드베이스를 탐색하는 동안, 기존 문서도 함께 찾아라:

### 파일 구조

대부분의 레포는 단일 컨텍스트를 가진다:

(원문의 파일 트리 참조 — CONTEXT.md + docs/adr/ + src/)

루트에 `CONTEXT-MAP.md`가 존재하면, 그 레포는 여러 컨텍스트를 가진 것이다. 이 맵은 각 컨텍스트가 어디에 있는지를 가리킨다(원문의 ordering/billing 트리 참조).

파일은 게으르게(lazily) 만들어라 — 쓸 내용이 생겼을 때만. `CONTEXT.md`가 없으면 첫 용어가 확정될 때 만들고, `docs/adr/`이 없으면 첫 ADR이 필요할 때 만든다.

## 세션 진행 중

### 용어집에 비추어 도전하라

사용자가 `CONTEXT.md`의 기존 언어와 충돌하는 용어를 쓰면, 즉시 지적하라. "당신 용어집은 'cancellation'을 X로 정의했는데, 지금은 Y를 의미하는 것 같다 — 뭐가 맞나?"

### 모호한 언어를 날카롭게 하라

사용자가 막연하거나 과부하된 용어를 쓰면, 정밀한 표준 용어를 제안하라. "당신은 'account'라고 하는데 — Customer인가 User인가? 둘은 다른 것이다."

### 구체적 시나리오를 논하라

도메인 관계가 논의될 때, 구체적 시나리오로 그것을 stress-test하라. 엣지 케이스를 파고드는 시나리오를 만들어, 개념들 사이의 경계에 대해 사용자가 정밀해지도록 강제하라.

### 코드와 교차 참조하라

사용자가 무언가가 어떻게 동작하는지 말하면, 코드가 그 말에 동의하는지 확인하라. 모순을 발견하면 표면화하라: "당신 코드는 Order 전체를 취소하는데, 방금 부분 취소가 가능하다고 했다 — 뭐가 맞나?"

### CONTEXT.md를 인라인으로 갱신하라

용어가 확정되면, 바로 그 자리에서 `CONTEXT.md`를 갱신하라. 모아두지 마라 — 발생하는 즉시 포착하라. [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md)의 형식을 사용하라.

`CONTEXT.md`는 구현 세부사항이 전혀 없어야 한다. `CONTEXT.md`를 스펙, 스크래치패드, 또는 구현 결정의 저장소로 취급하지 마라. 그것은 용어집이며 그 외에 아무것도 아니다.

### ADR은 인색하게 제안하라

다음 셋이 모두 참일 때만 ADR 생성을 제안하라:

1. **되돌리기 어렵다** — 나중에 마음을 바꾸는 비용이 의미 있게 크다
2. **맥락 없이는 의아하다** — 미래의 독자가 "왜 이렇게 했지?"라고 궁금해한다
3. **진짜 트레이드오프의 결과다** — 실제 대안들이 있었고 구체적 이유로 하나를 골랐다

셋 중 하나라도 빠지면 ADR을 건너뛰어라. [ADR-FORMAT.md](./ADR-FORMAT.md)의 형식을 사용하라.

</supporting-info>
````

## 부속 원문 (CONTEXT-FORMAT.md)

````
# CONTEXT.md Format

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Be opinionated.** When multiple words exist for the same concept, pick the best one and list the others under `_Avoid_`.
- **Keep definitions tight.** One or two sentences max. Define what it IS, not what it does.
- **Only include terms specific to this project's context.** General programming concepts (timeouts, error types, utility patterns) don't belong even if the project uses them extensively. Before adding a term, ask: is this a concept unique to this context, or a general programming concept? Only the former belongs.
- **Group terms under subheadings** when natural clusters emerge. If all terms belong to a single cohesive area, a flat list is fine.

## Single vs multi-context repos

**Single context (most repos):** One `CONTEXT.md` at the repo root.

**Multiple contexts:** A `CONTEXT-MAP.md` at the repo root lists the contexts, where they live, and how they relate to each other:

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md) — receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md) — generates invoices and processes payments
- [Fulfillment](./src/fulfillment/CONTEXT.md) — manages warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

The skill infers which structure applies:

- If `CONTEXT-MAP.md` exists, read it to find contexts
- If only a root `CONTEXT.md` exists, single context
- If neither exists, create a root `CONTEXT.md` lazily when the first term is resolved

When multiple contexts exist, infer which one the current topic relates to. If unclear, ask.
````

## 부속 원문 해석본 (CONTEXT-FORMAT.md)

````
# CONTEXT.md 형식

## 구조

(원문의 템플릿 참조 — 컨텍스트 이름 + 한두 문장 설명 + ## Language 섹션)

용어 정의는 다음 형태를 따른다:

**Order**: (그 용어에 대한 한두 문장 설명)
_Avoid_: Purchase, transaction   ← 피해야 할 동의어

**Invoice**: 배송 후 고객에게 보내는 지불 요청.
_Avoid_: Bill, payment request

**Customer**: 주문을 넣는 사람 또는 조직.
_Avoid_: Client, buyer, account

## 규칙

- **의견을 가져라(Be opinionated).** 같은 개념에 여러 단어가 존재하면, 최선의 하나를 고르고 나머지는 `_Avoid_` 아래에 나열하라.
- **정의는 빡빡하게 유지하라.** 최대 한두 문장. 그것이 무엇을 하는지가 아니라 무엇인지(IS)를 정의하라.
- **이 프로젝트 컨텍스트에 고유한 용어만 포함하라.** 일반 프로그래밍 개념(timeout, 에러 타입, 유틸 패턴)은 프로젝트가 많이 쓰더라도 들어가면 안 된다. 용어를 추가하기 전에 물어라: 이것이 이 컨텍스트에 고유한 개념인가, 아니면 일반 프로그래밍 개념인가? 전자만 해당한다.
- **자연스러운 군집이 생기면 소제목으로 묶어라.** 모든 용어가 하나의 응집된 영역에 속하면 평평한 목록도 괜찮다.

## 단일 vs 다중 컨텍스트 레포

**단일 컨텍스트(대부분의 레포):** 레포 루트에 `CONTEXT.md` 하나.

**다중 컨텍스트:** 레포 루트의 `CONTEXT-MAP.md`가 컨텍스트들, 그것들이 어디 사는지, 서로 어떻게 관계하는지를 나열한다(원문의 Context Map 예시 참조 — Contexts 목록 + Relationships로 이벤트 흐름·공유 타입 명시).

스킬은 어느 구조가 적용되는지 추론한다:

- `CONTEXT-MAP.md`가 존재하면, 그것을 읽어 컨텍스트들을 찾는다
- 루트 `CONTEXT.md`만 존재하면, 단일 컨텍스트
- 둘 다 없으면, 첫 용어가 확정될 때 루트 `CONTEXT.md`를 게으르게 생성한다

여러 컨텍스트가 존재할 때는 현재 주제가 어느 것과 관련되는지 추론하라. 불분명하면 물어라.
````

## 부속 원문 (ADR-FORMAT.md)

````
# ADR Format

ADRs live in `docs/adr/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, etc.

Create the `docs/adr/` directory lazily — only when the first ADR is needed.

## Template

```md
# {Short title of the decision}

{1-3 sentences: what's the context, what did we decide, and why.}
```

That's it. An ADR can be a single paragraph. The value is in recording *that* a decision was made and *why* — not in filling out sections.

## Optional sections

Only include these when they add genuine value. Most ADRs won't need them.

- **Status** frontmatter (`proposed | accepted | deprecated | superseded by ADR-NNNN`) — useful when decisions are revisited
- **Considered Options** — only when the rejected alternatives are worth remembering
- **Consequences** — only when non-obvious downstream effects need to be called out

## Numbering

Scan `docs/adr/` for the highest existing number and increment by one.

## When to offer an ADR

All three of these must be true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will look at the code and wonder "why on earth did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If a decision is easy to reverse, skip it — you'll just reverse it. If it's not surprising, nobody will wonder why. If there was no real alternative, there's nothing to record beyond "we did the obvious thing."

### What qualifies

- **Architectural shape.** "We're using a monorepo." "The write model is event-sourced, the read model is projected into Postgres."
- **Integration patterns between contexts.** "Ordering and Billing communicate via domain events, not synchronous HTTP."
- **Technology choices that carry lock-in.** Database, message bus, auth provider, deployment target. Not every library — just the ones that would take a quarter to swap out.
- **Boundary and scope decisions.** "Customer data is owned by the Customer context; other contexts reference it by ID only." The explicit no-s are as valuable as the yes-s.
- **Deliberate deviations from the obvious path.** "We're using manual SQL instead of an ORM because X." Anything where a reasonable reader would assume the opposite. These stop the next engineer from "fixing" something that was deliberate.
- **Constraints not visible in the code.** "We can't use AWS because of compliance requirements." "Response times must be under 200ms because of the partner API contract."
- **Rejected alternatives when the rejection is non-obvious.** If you considered GraphQL and picked REST for subtle reasons, record it — otherwise someone will suggest GraphQL again in six months.
````

## 부속 원문 해석본 (ADR-FORMAT.md)

* ADR = Architecture Decision Record (아키텍처 결정 기록)
  프로젝트에서 내린 중요한 결정 하나와 그 이유를 짧게 적어 남기는 문서입니다. 코드만 봐서는 "왜 이렇게 했는지" 알 수 없는 결정을, 미래의 개발자(혹은 미래의 나)를 위해 기록해 두는 게 목적입니다.

````
# ADR 형식

ADR은 `docs/adr/`에 살며 순차 번호를 쓴다: `0001-slug.md`, `0002-slug.md` 등.

`docs/adr/` 디렉터리는 게으르게 만들어라 — 첫 ADR이 필요할 때만.

## 템플릿

(원문 참조 — 결정의 짧은 제목 + "맥락이 뭐고, 무엇을 결정했고, 왜인지" 1~3문장)

그게 전부다. ADR은 한 단락이어도 된다. 가치는 결정이 내려졌다는 사실(*that*)과 왜(*why*)를 기록하는 데 있다 — 섹션을 채우는 데 있지 않다.

## 선택 섹션

진짜 가치를 더할 때만 포함하라. 대부분의 ADR은 필요 없다.

- **Status** 프론트매터(`proposed | accepted | deprecated | superseded by ADR-NNNN`) — 결정이 재검토될 때 유용
- **Considered Options** — 기각된 대안이 기억할 가치가 있을 때만
- **Consequences** — 이 결정 때문에 나중에 따라오는, 한눈에 예상하기 어려운 영향(부작용·파급 효과)을 미리 짚어둬야 할 때만

## 번호 매기기

`docs/adr/`에서 가장 큰 기존 번호를 스캔해 1 증가시킨다.

## 언제 ADR을 제안하나

다음 셋이 모두 참이어야 한다:

1. **되돌리기 어렵다** — 나중에 마음을 바꾸는 비용이 의미 있게 크다
2. **맥락 없이는 의아하다** — 미래의 독자가 코드를 보고 "도대체 왜 이렇게 했지?"라고 궁금해한다
3. **진짜 트레이드오프의 결과다** — 실제 대안들이 있었고 구체적 이유로 하나를 골랐다

되돌리기 쉬운 결정이면 건너뛰어라 — 어차피 되돌릴 테니. 의아하지 않으면 아무도 왜인지 궁금해하지 않는다. 진짜 대안이 없었다면 "당연한 걸 했다" 외에 기록할 게 없다.

### 무엇이 해당하나

- **아키텍처 형태.** "모노레포를 쓴다." "쓰기 모델은 이벤트 소싱, 읽기 모델은 Postgres로 투영."
- **컨텍스트 간 통합 패턴.** "Ordering과 Billing은 동기 HTTP가 아니라 도메인 이벤트로 통신한다."
- **락인(lock-in)을 동반하는 기술 선택.** DB, 메시지 버스, 인증 제공자, 배포 타깃. 모든 라이브러리가 아니라 — 교체에 분기(quarter) 단위가 걸리는 것들만.
- **경계·범위 결정.** "Customer 데이터는 Customer 컨텍스트가 소유하고, 다른 컨텍스트는 ID로만 참조한다." 명시적인 'no'는 'yes'만큼 가치 있다.
- **명백한 길에서의 의도적 이탈.** "ORM 대신 수동 SQL을 쓴다, 이유는 X." 합리적 독자가 반대로 가정할 만한 모든 것. 이것이 다음 엔지니어가 의도적인 것을 "고치는" 일을 막는다.
- **코드에 보이지 않는 제약.** "컴플라이언스 요구로 AWS를 쓸 수 없다." "파트너 API 계약 때문에 응답 시간은 200ms 미만이어야 한다."
- **기각된 대안 중 기각 이유가 비자명한 것.** GraphQL을 검토하고 미묘한 이유로 REST를 골랐다면 기록하라 — 안 그러면 6개월 뒤 누군가 다시 GraphQL을 제안한다.
````

## 해석·분석

- **문서 구조 인식:** `CONTEXT.md`(용어집) + `docs/adr/`(아키텍처 결정 기록)를 찾는다. `CONTEXT-MAP.md`가 있으면 멀티 컨텍스트(바운디드 컨텍스트별 분리) 레포로 간주.
- **세션 중 4가지 압박 기법:**
  1. **용어집 충돌 시 즉시 지적** — "용어집은 'cancellation'을 X로 정의했는데 지금 Y를 의미한다, 뭐가 맞나?"
  2. **모호한 언어 날카롭게** — "'account'가 Customer인가 User인가? 둘은 다르다."
  3. **구체적 시나리오로 검증** — 엣지 케이스를 꾸며 개념 경계를 강제 정밀화.
  4. **코드와 교차 검증** — 말한 동작과 코드가 모순되면 표면화.
- **인라인 문서 갱신:** 용어가 확정되면 그 자리에서 즉시 `CONTEXT.md` 업데이트(배치 금지).
- **CONTEXT.md는 "순수 용어집"** — 구현 세부·스펙·스크래치패드로 쓰면 안 됨.
- **ADR은 인색하게:** ① 되돌리기 어렵다 ② 맥락 없이는 의아하다 ③ 진짜 트레이드오프의 결과다 — **3개 모두** 충족 시에만 제안.
- 부속 파일 통찰: `CONTEXT-FORMAT`은 `_Avoid_`로 동의어를 배제하는 **의견 있는 용어집**, `ADR-FORMAT`은 **한 단락이어도 충분**(가치는 "결정이 있었다 + 왜"의 기록).

## grill-me와의 차이

전자([01_grill-me.md](01_grill-me.md))는 순수 사고 정리, 후자는 그 결과를 **프로젝트의 공식 언어와 영구 문서에 정착**시킨다. 후자는 tdd/diagnose/to-prd가 참조하는 glossary와 ADR의 **공급원**이 다.
