# 맷 포콕: /tdd

- 출처: https://github.com/mattpocock/skills
- 위치: `skills/engineering/tdd/`
- 부속 파일: `deep-modules.md`, `tests.md`, `mocking.md`, `interface-design.md`, `refactoring.md`

## 원문 (SKILL.md)

````
---
name: tdd
description: Test-driven development with red-green-refactor loop. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or asks for test-first development.
---

# Test-Driven Development

## Philosophy

**Core principle**: Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

**Good tests** are integration-style: they exercise real code paths through public APIs. They describe _what_ the system does, not _how_ it does it. A good test reads like a specification - "user can checkout with valid cart" tells you exactly what capability exists. These tests survive refactors because they don't care about internal structure.

**Bad tests** are coupled to implementation. They mock internal collaborators, test private methods, or verify through external means (like querying a database directly instead of using the interface). The warning sign: your test breaks when you refactor, but behavior hasn't changed. If you rename an internal function and tests fail, those tests were testing implementation, not behavior.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Anti-Pattern: Horizontal Slices

**DO NOT write all tests first, then all implementation.** This is "horizontal slicing" - treating RED as "write all tests" and GREEN as "write all code."

This produces **crap tests**:

- Tests written in bulk test _imagined_ behavior, not _actual_ behavior
- You end up testing the _shape_ of things (data structures, function signatures) rather than user-facing behavior
- Tests become insensitive to real changes - they pass when behavior breaks, fail when behavior is fine
- You outrun your headlights, committing to test structure before understanding the implementation

**Correct approach**: Vertical slices via tracer bullets. One test → one implementation → repeat. Each test responds to what you learned from the previous cycle. Because you just wrote the code, you know exactly what behavior matters and how to verify it.

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
  ...
```

## Workflow

### 1. Planning

When exploring the codebase, use the project's domain glossary so that test names and interface vocabulary match the project's language, and respect ADRs in the area you're touching.

Before writing any code:

- [ ] Confirm with user what interface changes are needed
- [ ] Confirm with user which behaviors to test (prioritize)
- [ ] Identify opportunities for [deep modules](deep-modules.md) (small interface, deep implementation)
- [ ] Design interfaces for [testability](interface-design.md)
- [ ] List the behaviors to test (not implementation steps)
- [ ] Get user approval on the plan

Ask: "What should the public interface look like? Which behaviors are most important to test?"

**You can't test everything.** Confirm with the user exactly which behaviors matter most. Focus testing effort on critical paths and complex logic, not every possible edge case.

### 2. Tracer Bullet

Write ONE test that confirms ONE thing about the system:

```
RED:   Write test for first behavior → test fails
GREEN: Write minimal code to pass → test passes
```

This is your tracer bullet - proves the path works end-to-end.

### 3. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules:

- One test at a time
- Only enough code to pass current test
- Don't anticipate future tests
- Keep tests focused on observable behavior

### 4. Refactor

After all tests pass, look for [refactor candidates](refactoring.md):

- [ ] Extract duplication
- [ ] Deepen modules (move complexity behind simple interfaces)
- [ ] Apply SOLID principles where natural
- [ ] Consider what new code reveals about existing code
- [ ] Run tests after each refactor step

**Never refactor while RED.** Get to GREEN first.

## Checklist Per Cycle

```
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
```
````

## 원문 해석본 (SKILL.md)

````
---
name: tdd
description: red-green-refactor 루프를 쓰는 테스트 주도 개발. 사용자가 TDD로 기능을 만들거나 버그를 고치고 싶을 때, "red-green-refactor"를 언급할 때, 통합 테스트를 원할 때, 또는 테스트 우선(test-first) 개발을 요청할 때 사용한다.
---

# 테스트 주도 개발 (TDD)

## 철학

**핵심 원칙:** 테스트는 구현 세부사항이 아니라 공개 인터페이스를 통한 행동(behavior)을 검증해야 한다. 코드는 통째로 바뀔 수 있지만, 테스트는 바뀌면 안 된다.

**좋은 테스트**는 통합 스타일이다: 공개 API를 통해 실제 코드 경로를 실행한다. 시스템이 *어떻게(how)*가 아니라 *무엇을(what)* 하는지를 기술한다. 좋은 테스트는 명세처럼 읽힌다 — "사용자는 유효한 장바구니로 결제할 수 있다"는 어떤 기능이 존재하는지 정확히 알려준다. 이런 테스트는 내부 구조에 신경 쓰지 않으므로 리팩토링을 살아남는다.

**나쁜 테스트**는 구현에 결합되어 있다. 내부 협력자를 mock하거나, private 메서드를 테스트하거나, 외부 수단으로 검증한다(인터페이스를 쓰는 대신 DB를 직접 쿼리하는 등). 경고 신호: 리팩토링했는데 행동은 안 바뀌었는데 테스트가 깨진다. 내부 함수 이름을 바꿨더니 테스트가 실패한다면, 그 테스트는 행동이 아니라 구현을 테스트하던 것이다.

예시는 [tests.md](tests.md), mocking 지침은 [mocking.md](mocking.md) 참조.

## 안티패턴: 수평 슬라이싱(Horizontal Slices)

**테스트를 전부 먼저 쓰고 구현을 전부 나중에 쓰지 마라.** 이것이 "수평 슬라이싱" — RED을 "테스트 다 쓰기", GREEN을 "코드 다 쓰기"로 취급하는 것.

이건 **쓰레기 테스트**를 만든다:

- 한꺼번에 쓴 테스트는 *실제* 행동이 아니라 *상상한* 행동을 검증한다
- 결국 사용자가 마주하는 행동이 아니라 것들의 *모양*(데이터 구조, 함수 시그니처)을 테스트하게 된다
- 테스트가 실제 변화에 둔감해진다 — 행동이 깨져도 통과하고, 행동이 멀쩡해도 실패한다
- 헤드라이트보다 앞서 달리게 된다 — 구현을 이해하기도 전에 테스트 구조에 못박힌다

**올바른 접근:** 트레이서 불릿(tracer bullet)을 통한 수직 슬라이스. 테스트 하나 → 구현 하나 → 반복. 각 테스트는 이전 사이클에서 배운 것에 반응한다. 방금 코드를 짰기 때문에, 어떤 행동이 중요한지 그리고 그것을 어떻게 검증하는지 정확히 안다.

```
틀림 (수평):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

옳음 (수직):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
  ...
```

## 워크플로

### 1. 계획(Planning)

코드베이스를 탐색할 때, 프로젝트의 도메인 용어집을 써서 테스트 이름과 인터페이스 어휘가 프로젝트 언어와 맞도록 하고, 건드리는 영역의 ADR을 존중하라.

코드를 쓰기 전에:

- [ ] 어떤 인터페이스 변경이 필요한지 사용자와 확인
- [ ] 어떤 행동을 테스트할지 사용자와 확인(우선순위 부여)
- [ ] [deep module](deep-modules.md)(작은 인터페이스, 깊은 구현) 기회 식별
- [ ] [테스트 용이성](interface-design.md)을 위한 인터페이스 설계
- [ ] 테스트할 행동 목록 작성(구현 단계가 아니라)
- [ ] 계획에 대한 사용자 승인 획득

물어라: "공개 인터페이스는 어떤 모습이어야 하나? 어떤 행동이 테스트하기에 가장 중요한가?"

**전부 테스트할 수는 없다.** 어떤 행동이 가장 중요한지 정확히 사용자와 확인하라. 모든 가능한 엣지 케이스가 아니라, 핵심 경로와 복잡한 로직에 테스트 노력을 집중하라.

### 2. 트레이서 불릿(Tracer Bullet)

시스템에 대해 한 가지를 확인하는 테스트 하나를 쓴다:

```
RED:   첫 행동에 대한 테스트 작성 → 테스트 실패
GREEN: 통과시킬 최소 코드 작성 → 테스트 통과
```

이것이 너의 트레이서 불릿이다 — 경로가 끝에서 끝까지 작동함을 증명한다.

### 3. 점진적 루프(Incremental Loop)

남은 각 행동에 대해:

```
RED:   다음 테스트 작성 → 실패
GREEN: 통과시킬 최소 코드 → 통과
```

규칙:

- 한 번에 한 테스트
- 현재 테스트를 통과시킬 만큼의 코드만
- 미래 테스트를 예상하지 마라
- 테스트는 관찰 가능한 행동에 집중

### 4. 리팩토링(Refactor)

모든 테스트가 통과한 뒤, [리팩토링 후보](refactoring.md)를 찾는다:

- [ ] 중복 추출
- [ ] 모듈 깊게 하기(복잡성을 단순한 인터페이스 뒤로 옮기기)
- [ ] 자연스러운 곳에 SOLID 원칙 적용
- [ ] 새 코드가 기존 코드에 대해 드러내는 것을 고려
- [ ] 각 리팩토링 단계 후 테스트 실행

**RED 상태에서는 절대 리팩토링하지 마라.** 먼저 GREEN에 도달하라.

## 사이클별 체크리스트

```
[ ] 테스트가 구현이 아니라 행동을 기술한다
[ ] 테스트가 공개 인터페이스만 쓴다
[ ] 테스트가 내부 리팩토링을 살아남는다
[ ] 코드가 이 테스트에 대해 최소다
[ ] 투기적(speculative) 기능을 추가하지 않았다
```
````

## 부속 원문 (deep-modules.md)

```
# Deep Modules

From "A Philosophy of Software Design":

**Deep module** = small interface + lots of implementation

┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
│                     │
└─────────────────────┘

**Shallow module** = large interface + little implementation (avoid)

┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘

When designing interfaces, ask:

- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?
```

### 해석본

```
# 깊은 모듈 (Deep Modules)

"A Philosophy of Software Design"(존 오스터하우트)에서 인용:

**깊은 모듈** = 작은 인터페이스 + 많은 구현

┌─────────────────────┐
│   작은 인터페이스    │  ← 메서드 적음, 단순한 파라미터
├─────────────────────┤
│                     │
│                     │
│     깊은 구현        │  ← 복잡한 로직을 안에 숨김
│                     │
│                     │
└─────────────────────┘

**얕은 모듈** = 큰 인터페이스 + 적은 구현 (피하라)

┌─────────────────────────────────┐
│        큰 인터페이스             │  ← 메서드 많음, 복잡한 파라미터
├─────────────────────────────────┤
│  얇은 구현                       │  ← 그냥 통과만 시킴
└─────────────────────────────────┘

인터페이스를 설계할 때 물어라:

- 메서드 수를 줄일 수 있나?
- 파라미터를 단순화할 수 있나?
- 더 많은 복잡성을 안에 숨길 수 있나?
```

**요지:** 좋은 모듈은 *쓰는 쪽이 마주하는 면(인터페이스)은 작고 단순*하면서, *그 뒤에 숨긴 일(구현)은 많은* 모듈이다. 호출자는 적은 메서드·단순한 인자만 알면 되고, 복잡한 로직은 모듈 안에 감춰진다. 반대로 메서드가 많고 파라미터가 복잡한데 실제로 하는 일은 그냥 다른 곳으로 넘기기만 하는 "얕은 모듈"은 피해야 한다 — 복잡성을 감추지 못하고 오히려 호출자에게 떠넘기기 때문이다.

## 부속 원문 (tests.md)

````
# Good and Bad Tests

## Good Tests

**Integration-style**: Test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: Tests observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

Characteristics:

- Tests behavior users/callers care about
- Uses public API only
- Survives internal refactors
- Describes WHAT, not HOW
- One logical assertion per test

## Bad Tests

**Implementation-detail tests**: Coupled to internal structure.

```typescript
// BAD: Tests implementation details
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Red flags:

- Mocking internal collaborators
- Testing private methods
- Asserting on call counts/order
- Test breaks when refactoring without behavior change
- Test name describes HOW not WHAT
- Verifying through external means instead of interface

```typescript
// BAD: Bypasses interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: Verifies through interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```
````

### 해석본

````
# 좋은 테스트와 나쁜 테스트

## 좋은 테스트

**통합 스타일(Integration-style)**: 내부 부품을 mock하지 말고, 실제 인터페이스를 통해 테스트하라.

```typescript
// 좋음: 관찰 가능한 행동을 테스트
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

특징:

- 사용자/호출자가 신경 쓰는 행동을 테스트한다
- 공개 API만 쓴다
- 내부 리팩토링을 살아남는다
- 어떻게(HOW)가 아니라 무엇을(WHAT)을 기술한다
- 테스트당 하나의 논리적 단언

## 나쁜 테스트

**구현 세부 테스트(Implementation-detail tests)**: 내부 구조에 결합되어 있다.

```typescript
// 나쁨: 구현 세부사항을 테스트
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

경고 신호(Red flags):

- 내부 협력자를 mock함
- private 메서드를 테스트함
- 호출 횟수/순서에 단언함
- 행동 변화 없이 리팩토링했는데 테스트가 깨짐
- 테스트 이름이 WHAT이 아니라 HOW를 기술함
- 인터페이스 대신 외부 수단으로 검증함

```typescript
// 나쁨: 검증하려고 인터페이스를 우회
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// 좋음: 인터페이스를 통해 검증
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```
````

### 분석

이 문서는 SKILL.md "철학"의 *좋은 테스트 vs 나쁜 테스트*를 코드로 구체화한 것이다. 핵심 대비는 **"무엇을(WHAT) 검증하느냐 vs 어떻게(HOW) 하는지를 검증하느냐"**.

- **좋은 테스트 — 행동을 본다:** `checkout` 예시는 "유효한 장바구니로 결제하면 상태가 confirmed가 된다"는 *사용자가 신경 쓰는 결과*만 단언한다. 내부적으로 어떤 함수를 거치는지는 묻지 않으므로, 구현을 리팩토링해도 살아남는다. "테스트당 하나의 논리적 단언"은 실패했을 때 원인이 한 가지로 좁혀진다는 뜻.
- **나쁜 테스트 ① 구현 결합:** `checkout calls paymentService.process` 예시는 "내부적으로 process를 호출했는가"를 검증한다. 행동이 그대로여도 내부 호출 방식만 바꾸면 깨지는 — 전형적인 **HOW 테스트**. 내부 협력자 mock, private 메서드 검증, 호출 횟수·순서 단언이 모두 이 부류의 red flag. → [[#부속 원문 (mocking.md)|mocking.md]]의 "내 코드는 mock 금지"와 같은 경고.
- **나쁜 테스트 ② 인터페이스 우회:** `createUser saves to database` 예시는 결과를 확인하려고 DB를 직접 쿼리한다. 이러면 *공개 인터페이스가 깨져도* 테스트는 통과할 수 있어(예: 저장은 되는데 조회가 안 되는 버그) 의미가 약하다. 바로 아래 "좋음" 버전처럼 `getUser`라는 **인터페이스로 되읽어** 검증해야, 사용자가 실제로 겪는 경로를 그대로 테스트한다.
- **한 줄 요지:** *테스트가 리팩토링에 깨지면 그건 행동이 아니라 구현을 테스트하던 것* — SKILL.md의 핵심 원칙을 그대로 예시화한다.

## 부속 원문 (mocking.md)

````
# When to Mock

Mock at **system boundaries** only:

- External APIs (payment, email, etc.)
- Databases (sometimes - prefer test DB)
- Time/randomness
- File system (sometimes)

Don't mock:

- Your own classes/modules
- Internal collaborators
- Anything you control

## Designing for Mockability

At system boundaries, design interfaces that are easy to mock:

**1. Use dependency injection**

Pass external dependencies in rather than creating them internally:

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. Prefer SDK-style interfaces over generic fetchers**

Create specific functions for each external operation instead of one generic function with conditional logic:

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

The SDK approach means:
- Each mock returns one specific shape
- No conditional logic in test setup
- Easier to see which endpoints a test exercises
- Type safety per endpoint
````

### 해석본

````
# 언제 Mock하나

**시스템 경계(system boundaries)**에서만 mock하라:

- 외부 API (결제, 이메일 등)
- 데이터베이스 (때때로 - 가능하면 테스트 DB를 선호)
- 시간/무작위성(Time/randomness)
- 파일 시스템 (때때로)

Mock하지 마라:

- 너 자신의 클래스/모듈
- 내부 협력자(internal collaborators)
- 네가 통제하는 모든 것

## Mock 가능성을 위한 설계

시스템 경계에서는, mock하기 쉬운 인터페이스를 설계하라:

**1. 의존성 주입(dependency injection)을 써라**

외부 의존성을 내부에서 만들지 말고 밖에서 넘겨받아라:

```typescript
// mock하기 쉬움
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// mock하기 어려움
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. 범용 fetcher보다 SDK 스타일 인터페이스를 선호하라**

조건 로직이 든 범용 함수 하나 대신, 각 외부 작업마다 구체적인 함수를 만들어라:

```typescript
// 좋음: 각 함수가 독립적으로 mock 가능
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// 나쁨: mock하려면 mock 안에 조건 로직이 필요
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK 방식의 의미:
- 각 mock이 하나의 구체적 형태(shape)를 반환
- 테스트 셋업에 조건 로직이 없음
- 테스트가 어떤 엔드포인트를 쓰는지 보기 쉬움
- 엔드포인트별 타입 안전성
````

### 분석

핵심은 **"어디까지 mock하고 어디부터는 안 하나"의 선 긋기**다.

- **시스템 경계에서만 mock:** 내가 통제할 수 없는 바깥 세계(외부 API·DB·시간·파일시스템)만 mock한다. 이런 건 느리고, 비결정적이고, 진짜로 호출하면 곤란(실제 결제 등)하기 때문.
- **내 코드는 mock 금지:** 내부 협력자나 내가 만든 클래스를 mock하면 [[#부속 원문 (tests.md)|tests.md]]에서 말한 "나쁜 테스트"가 된다 — 구현에 결합돼 리팩토링하면 깨진다. 내 코드끼리는 진짜로 같이 돌려서 행동을 검증해야 한다.
- **DI로 경계를 끌어내라:** 함수 안에서 `new StripeClient(...)`를 만들면 그 외부 의존성이 코드에 박혀 mock으로 갈아끼울 수 없다. 인자로 받으면 테스트에서 가짜 client를 넣을 수 있다. → [[#부속 원문 (interface-design.md)|interface-design.md]]의 1번 규칙과 같은 원칙.
- **SDK 스타일 vs 범용 fetcher:** `fetch(endpoint, options)` 같은 만능 함수 하나를 mock하면, 호출하는 엔드포인트마다 "이 URL이면 이걸 반환" 식의 **조건 분기를 mock 안에 직접 짜야** 한다. 반대로 `getUser`, `getOrders`처럼 작업별 함수로 쪼개 두면 각각을 독립적으로 mock할 수 있어 셋업이 단순하고, 테스트가 어떤 외부 호출을 쓰는지도 한눈에 보인다. *경계 인터페이스도 "작고 구체적인 면"으로 쪼개는 게 테스트에 유리*하다는 점에서 deep module 사고와 맞닿는다.

## 부속 원문 (interface-design.md)

````
# Interface Design for Testability

Good interfaces make testing natural:

1. **Accept dependencies, don't create them**

   ```typescript
   // Testable
   function processOrder(order, paymentGateway) {}

   // Hard to test
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **Return results, don't produce side effects**

   ```typescript
   // Testable
   function calculateDiscount(cart): Discount {}

   // Hard to test
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **Small surface area**
   - Fewer methods = fewer tests needed
   - Fewer params = simpler test setup
````

### 해석본

````
# 테스트 용이성을 위한 인터페이스 설계

좋은 인터페이스는 테스트를 자연스럽게 만든다:

1. **의존성을 주입받아라, 직접 만들지 마라**

   ```typescript
   // 테스트 가능
   function processOrder(order, paymentGateway) {}

   // 테스트 어려움
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **결과를 반환하라, 부작용(side effect)을 일으키지 마라**

   ```typescript
   // 테스트 가능
   function calculateDiscount(cart): Discount {}

   // 테스트 어려움
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **작은 표면적(surface area)**
   - 메서드가 적을수록 = 필요한 테스트도 적다
   - 파라미터가 적을수록 = 테스트 셋업이 단순하다
````

### 분석

세 규칙 모두 "테스트하기 쉬운 코드 = 좋은 설계"라는 같은 뿌리에서 나온다.

1. **의존성 주입(DI):** 함수 안에서 `new StripeGateway()`로 의존성을 직접 만들면, 테스트할 때 진짜 Stripe에 붙어버려 갈아끼울 수 없다. 반대로 `paymentGateway`를 인자로 받으면 테스트에서 가짜(mock)를 넣어 격리할 수 있다. → [[#부속 원문 (mocking.md)|mocking.md]] 부속의 "Use dependency injection"과 같은 원칙.
2. **결과 반환 vs 부작용:** `calculateDiscount`는 입력을 받아 값을 돌려주므로 반환값만 단언하면 끝난다. 반면 `applyDiscount`처럼 `cart.total`을 직접 깎는(부작용) 함수는, 무엇이 어떻게 바뀌었는지 외부 상태를 뒤져 확인해야 해서 테스트가 번거롭고 깨지기 쉽다. *순수 함수에 가까울수록 테스트가 쉽다*는 뜻.
3. **작은 표면적:** 인터페이스(메서드·파라미터)가 작을수록 테스트해야 할 조합이 줄고 셋업이 단순해진다. → [[#부속 원문 (deep-modules.md)|deep-modules.md]]의 "작은 인터페이스"와 직결된다. 결국 *테스트하기 좋은 인터페이스 = 깊은 모듈*.

## 부속 원문 (refactoring.md)

```
# Refactor Candidates

After TDD cycle, look for:

- **Duplication** → Extract function/class
- **Long methods** → Break into private helpers (keep tests on public interface)
- **Shallow modules** → Combine or deepen
- **Feature envy** → Move logic to where data lives
- **Primitive obsession** → Introduce value objects
- **Existing code** the new code reveals as problematic
```

### 해석본

```
# 리팩토링 후보

TDD 사이클을 마친 뒤, 다음을 찾아라:

- **중복(Duplication)** → 함수/클래스로 추출
- **긴 메서드(Long methods)** → private 헬퍼로 쪼개기 (테스트는 공개 인터페이스에 유지)
- **얕은 모듈(Shallow modules)** → 합치거나 더 깊게
- **기능 욕심(Feature envy)** → 데이터가 사는 곳으로 로직을 옮기기
- **원시 타입 집착(Primitive obsession)** → 값 객체(value object) 도입
- 새 코드가 문제로 드러낸 **기존 코드**
```

### 분석

리팩토링은 **GREEN(모든 테스트 통과) 상태에서만** 한다는 게 대전제다(SKILL.md의 "RED 상태에서 절대 리팩토링 금지"). 각 후보의 의미:

- **중복:** 같은 로직이 여러 곳에 있으면 함수/클래스로 뽑아 한 곳에서 관리한다. TDD가 끝난 직후가 중복이 가장 잘 보이는 시점.
- **긴 메서드:** 긴 메서드를 잘게 쪼개되, **테스트는 쪼갠 private 헬퍼가 아니라 공개 인터페이스에 그대로 둔다.** → 내부를 바꿔도 테스트가 안 깨지는, tdd 철학의 핵심.
- **얕은 모듈:** 인터페이스만 크고 알맹이가 없는 모듈은 합치거나 더 깊게 만든다. → [[#부속 원문 (deep-modules.md)|deep-modules.md]]와 직결.
- **기능 욕심(Feature envy):** 어떤 메서드가 자기 데이터보다 *남의 객체*의 데이터를 더 많이 쓴다면, 로직을 그 데이터가 있는 쪽으로 옮긴다. "데이터와 그 데이터를 다루는 로직은 같이 둔다"는 응집(cohesion) 원칙.
- **원시 타입 집착(Primitive obsession):** `string email`, `number money`처럼 원시 타입을 그대로 굴리지 말고 `Email`, `Money` 같은 값 객체로 감싼다. 검증·도메인 규칙을 타입 안에 모아 두기 위함. → [grill-with-docs](02_grill-with-docs.md)의 용어집(도메인 언어를 타입으로)과 통한다.
- **새 코드가 드러낸 기존 코드:** 방금 짠 코드 때문에 기존 코드의 설계 문제가 비로소 보이는 경우 — 그 신호를 놓치지 말고 함께 정리한다.

## 해석·분석

- **철학:** 테스트는 공개 인터페이스를 통한 **행동**을 검증. "코드는 통째로 바뀌어도 테스트는 안 바뀐다." 행동 변화 없이 리팩토링 시 테스트가 깨지면 = 구현을 테스트한 것.
- **가장 중요한 통찰 — 수평 슬라이싱 금지:** AI가 흔히 저지르는 "RED=테스트 다 쓰기, GREEN=코드 다 쓰기"를 정면 금지. 이유: 한꺼번에 쓴 테스트는 **상상한 행동**을 검증하고, 데이터 구조의 **"모양"** 만 검증하며, **"헤드라이트보다 앞서 달리는"** 문제 발생.
- **올바른 방법 — 수직 슬라이스 / 트레이서 불릿:** `test1→impl1 → test2→impl2`. 방금 코드를 짰기에 무엇이 중요한지 안다.
- **워크플로:** ① Planning(인터페이스·행동 우선순위 확정, deep module 식별, 사용자 승인 / "전부 테스트할 수 없다") → ② Tracer Bullet(단 하나로 경로 증명) → ③ Incremental Loop(한 번에 하나, 최소 코드, 미래 예측 금지) → ④ Refactor(**RED 상태에서 절대 리팩토링 금지**).
- 부속 파일은 John Ousterhout의 *A Philosophy of Software Design* 사상(깊은 모듈)을 깊게 반영.

## 트리거 조건

TDD로 기능/버그를 작업하고 싶을 때, "red-green-refactor"를 언급할 때, 통합 테스트를 원할 때, test-first 개발을 요청할 때.
