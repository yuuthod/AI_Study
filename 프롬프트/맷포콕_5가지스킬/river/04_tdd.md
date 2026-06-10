# 4. tdd — 테스트 주도 개발

- 출처: [github.com/mattpocock/skills](https://github.com/mattpocock/skills) · `skills/engineering/tdd/SKILL.md`
- 워크플로우 위치: **4단계** (구현)
- TDD = Test-Driven Development (테스트 주도 개발)

---

## 원문 (Original)

```markdown
---
name: tdd
description: Test-driven development with red-green-refactor loop. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or asks for test-first development.
---

# Test-Driven Development

## Philosophy
Core principle: Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

Good tests are integration-style: they exercise real code paths through public APIs. They describe what the system does, not how it does it. A good test reads like a specification. These tests survive refactors because they don't care about internal structure.

Bad tests are coupled to implementation. They mock internal collaborators, test private methods, or verify through external means. The warning sign: your test breaks when you refactor, but behavior hasn't changed.

## Anti-Pattern: Horizontal Slices
DO NOT write all tests first, then all implementation. This is "horizontal slicing".
This produces crap tests: tests written in bulk test imagined behavior, not actual behavior; you test the shape of things rather than user-facing behavior; tests become insensitive to real changes.

Correct approach: Vertical slices via tracer bullets. One test → one implementation → repeat.

    WRONG (horizontal):
      RED:   test1, test2, test3, test4, test5
      GREEN: impl1, impl2, impl3, impl4, impl5

    RIGHT (vertical):
      RED→GREEN: test1→impl1
      RED→GREEN: test2→impl2
      ...

## Workflow
### 1. Planning
Confirm interface changes, confirm which behaviors to test (prioritize), identify deep modules, design for testability, list behaviors (not steps), get user approval.
You can't test everything. Focus on critical paths and complex logic.

### 2. Tracer Bullet
Write ONE test that confirms ONE thing:
  RED:   test for first behavior → fails
  GREEN: minimal code to pass → passes

### 3. Incremental Loop
For each remaining behavior: RED (next test fails) → GREEN (minimal code passes).
Rules: one test at a time; only enough code to pass; don't anticipate future tests; keep tests on observable behavior.

### 4. Refactor
After all tests pass: extract duplication, deepen modules, apply SOLID where natural, run tests after each step.
Never refactor while RED. Get to GREEN first.

## Checklist Per Cycle
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
```

---

## 번역 (Translation)

```markdown
# 테스트 주도 개발

## 철학
핵심 원칙: 테스트는 구현 세부가 아니라 공개 인터페이스를 통해 "행위"를 검증해야 한다. 코드는 완전히 바뀔 수 있어도, 테스트는 바뀌면 안 된다.

좋은 테스트는 통합(integration) 스타일이다: 공개 API를 통해 실제 코드 경로를 실행한다. 시스템이 "무엇을" 하는지를 기술하지, "어떻게" 하는지는 기술하지 않는다. 좋은 테스트는 명세서처럼 읽힌다. 이런 테스트는 내부 구조에 무관심하기 때문에 리팩터를 견뎌낸다.

나쁜 테스트는 구현에 결합돼 있다. 내부 협력자를 목(mock)하고, 비공개 메서드를 테스트하고, 외부 수단으로 검증한다. 경고 신호: 행위는 그대로인데 리팩터하면 테스트가 깨진다.

## 안티패턴: 수평 슬라이스
모든 테스트를 먼저 쓰고, 그 다음 모든 구현을 쓰지 말 것. 이것이 "수평 슬라이싱"이다.
이것은 쓰레기 테스트를 만든다: 한꺼번에 쓴 테스트는 "실제" 행위가 아니라 "상상한" 행위를 테스트한다; 사용자 대면 행위가 아니라 "형태"를 테스트한다; 실제 변화에 둔감해진다.

올바른 접근: 트레이서 불릿을 통한 수직 슬라이스. 테스트 하나 → 구현 하나 → 반복.

## 워크플로우
### 1. 계획
인터페이스 변경 확인, 테스트할 행위 확인(우선순위), 깊은 모듈 식별, 테스트 가능하게 설계, (단계가 아닌) 행위 목록화, 사용자 승인.
모든 것을 테스트할 수는 없다. 핵심 경로와 복잡한 로직에 집중.

### 2. 트레이서 불릿
하나를 확인하는 테스트 하나를 쓴다: RED(첫 행위 테스트 실패) → GREEN(통과할 최소 코드).

### 3. 점진 루프
남은 각 행위마다: RED(다음 테스트 실패) → GREEN(최소 코드 통과).
규칙: 한 번에 한 테스트; 통과할 만큼만 코드; 미래 테스트를 예단하지 말 것; 관찰 가능한 행위에 집중.

### 4. 리팩터
모든 테스트 통과 후: 중복 추출, 모듈 심화, 자연스러운 곳에 SOLID 적용, 각 단계마다 테스트 실행.
RED 상태에서 절대 리팩터하지 말 것. 먼저 GREEN으로 가라.

## 사이클별 체크리스트
[ ] 테스트가 구현이 아닌 행위를 기술하는가
[ ] 테스트가 공개 인터페이스만 사용하는가
[ ] 테스트가 내부 리팩터를 견디는가
[ ] 코드가 이 테스트에 필요한 최소한인가
[ ] 추측성 기능을 추가하지 않았는가
```

---

## 해설

### 핵심 1 — 행위 vs 구현
이 스킬의 전부라 할 수 있는 원칙: **"코드는 완전히 바뀔 수 있어도 테스트는 바뀌면 안 된다."**
- 좋은 테스트: 공개 인터페이스로 "무엇을" 검증 → 리팩터를 견딤
- 나쁜 테스트: 내부 구현에 결합 → 행위가 같은데도 리팩터하면 깨짐

### 핵심 2 — 수평 슬라이스 안티패턴 (AI 특화)
일반 TDD 교본과 다른, **AI 에이전트를 겨냥한 독자적 경고**. AI는 "테스트 5개 먼저 → 구현 5개"라는 식으로 한꺼번에 일하려는 경향이 있는데, 이러면 *실제 행위가 아닌 상상한 행위*를 테스트하게 됨.
→ 강제 처방: **테스트 1개 → 구현 1개 → 반복**. [`to-issues`](03_to-issues.md)의 트레이서 불릿 개념이 여기서 다시 등장.

### 핵심 3 — RED 상태에서 리팩터 금지
"먼저 GREEN으로 가라(Get to GREEN first)." 테스트가 실패하는 동안에는 구조를 바꾸지 않는다 → 한 번에 한 가지 변수만 다룬다는 규율.

### 다른 스킬과의 연결
- **깊은 모듈** 개념이 [`to-prd`](02_to-prd.md), [`improve-codebase-architecture`](05_improve-codebase-architecture.md)와 공유됨.
- 보조 문서: `tests.md`(예시), `mocking.md`(목 가이드), `deep-modules.md`, `interface-design.md`, `refactoring.md` — 본문은 짧게 유지하고 상세는 참조 파일로 분리하는 **점진적 공개(progressive disclosure)** 구조.

### grill-me와의 길이 대비
grill-me는 11줄, tdd는 110줄. 같은 저자지만 **문제의 복잡도에 비례해 길이를 조절** — 지난 스터디 교훈 "길이와 품질은 비례하지 않는다"의 실증.

### 워크플로우 연결
3단계 이슈 → 4단계 TDD로 구현 → 구현이 쌓이면 5단계 [`improve-codebase-architecture`](05_improve-codebase-architecture.md)로 구조 개선.
