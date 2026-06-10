# 2. to-prd — PRD 문서 만들기

- 출처: [github.com/mattpocock/skills](https://github.com/mattpocock/skills) · `skills/engineering/to-prd/SKILL.md`
- 워크플로우 위치: **2단계** (요구사항 문서화)
- PRD = Product Requirements Document (제품 요구사항 문서)

---

## 원문 (Original)

```markdown
---
name: to-prd
description: Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to create a PRD from the current context.
---

This skill takes the current conversation context and codebase understanding and produces a PRD. Do NOT interview the user — just synthesize what you already know.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the PRD, and respect any ADRs in the area you're touching.

2. Sketch out the major modules you will need to build or modify to complete the implementation. Actively look for opportunities to extract deep modules that can be tested in isolation.

A deep module (as opposed to a shallow module) is one which encapsulates a lot of functionality in a simple, testable interface which rarely changes.

Check with the user that these modules match their expectations. Check with the user which modules they want tests written for.

3. Write the PRD using the template below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label - no need for additional triage.
```

### PRD 템플릿 (원문)

```markdown
## Problem Statement
The problem that the user is facing, from the user's perspective.

## Solution
The solution to the problem, from the user's perspective.

## User Stories
A LONG, numbered list of user stories. Each user story should be in the format of:
1. As an <actor>, I want a <feature>, so that <benefit>

## Implementation Decisions
A list of implementation decisions that were made.
(modules, interfaces, technical clarifications, architectural decisions,
 schema changes, API contracts, specific interactions)
Do NOT include specific file paths or code snippets.

## Testing Decisions
What makes a good test, which modules will be tested, prior art for the tests.

## Out of Scope
Things that are out of scope for this PRD.

## Further Notes
Any further notes about the feature.
```

---

## 번역 (Translation)

```markdown
---
name: to-prd
description: 현재 대화 맥락을 PRD로 만들어 프로젝트 이슈 트래커에 발행한다. 사용자가 현재 맥락에서 PRD를 만들고 싶을 때 사용한다.
---

이 스킬은 현재의 대화 맥락과 코드베이스 이해를 받아 PRD를 생성한다. 사용자를 인터뷰하지 말 것 — 이미 알고 있는 것을 합성하기만 하라.

이슈 트래커와 분류(triage) 라벨 용어가 제공되어 있어야 한다 — 없다면 `/setup-matt-pocock-skills`를 실행하라.

## 프로세스

1. 아직 안 했다면, 코드베이스의 현재 상태를 이해하기 위해 저장소를 탐색하라. PRD 전반에 프로젝트의 도메인 용어집을 사용하고, 건드리는 영역의 ADR을 존중하라.

2. 구현을 완료하기 위해 만들거나 수정해야 할 주요 모듈들을 스케치하라. 독립적으로 테스트 가능한 "깊은 모듈(deep module)"을 추출할 기회를 적극적으로 찾아라.

깊은 모듈이란 (얕은 모듈과 반대로) 많은 기능을, 거의 바뀌지 않는 단순하고 테스트 가능한 인터페이스 뒤에 캡슐화한 것이다.

이 모듈들이 사용자의 기대와 맞는지 확인하라. 어떤 모듈에 테스트를 작성할지 사용자에게 확인하라.

3. 아래 템플릿으로 PRD를 작성한 뒤 이슈 트래커에 발행하라. `ready-for-agent` 분류 라벨을 적용한다 — 추가 분류는 불필요.
```

### PRD 템플릿 (번역)

- **문제 진술**: 사용자 관점에서 겪고 있는 문제
- **해결책**: 사용자 관점에서의 해결책
- **사용자 스토리**: 길고 번호 매긴 목록. `<액터>로서, 나는 <기능>을 원한다, <이점>을 위해` 형식
- **구현 결정**: 모듈, 인터페이스, 기술적 명확화, 아키텍처 결정, 스키마 변경, API 계약 등 (구체적 파일 경로·코드 조각은 제외)
- **테스트 결정**: 좋은 테스트의 기준, 테스트할 모듈, 기존 유사 테스트(prior art)
- **범위 외**: 이 PRD에서 다루지 않는 것
- **추가 노트**: 그 밖의 메모

---

## 해설

### 핵심 동작
- **인터뷰 금지**: grill-me와 정반대. 이미 대화에서 합의된 내용을 **합성(synthesize)**만 함.
- **깊은 모듈 발굴**: 단순 문서화가 아니라, 구현할 모듈을 미리 스케치하며 "깊은 모듈" 기회를 찾음.
- **자동 발행**: 완성된 PRD를 이슈 트래커(GitHub Issues 등)에 `ready-for-agent` 라벨로 자동 발행.

### 깊은 모듈 vs 얕은 모듈 (핵심 개념)
존 오스터하우트 *A Philosophy of Software Design*에서 온 개념. **깊은 모듈**은 "복잡한 구현"을 "단순한 인터페이스" 뒤에 숨김 → 호출자가 알아야 할 게 적고 테스트하기 쉬움. 이 개념은 [`tdd`](04_tdd.md)와 [`improve-codebase-architecture`](05_improve-codebase-architecture.md)에서 반복적으로 등장하는 맷 포콕 스킬군의 **공통 축**입니다.

### grill-me와의 대비
| | grill-me | to-prd |
|---|----------|--------|
| 사용자에게 질문하나? | 집요하게 함 | 절대 안 함 |
| 역할 | 이해를 **만든다** | 이해를 **기록한다** |
| 산출물 | 없음 (대화가 결과) | PRD 문서 (이슈로 발행) |

지난 스터디에서 river가 지적한 "grill-me는 산출물이 없다"는 단점을, to-prd가 **바로 다음 단계에서 보완**하는 구조입니다.

### 워크플로우 연결
1단계 grill-me의 합의 → 2단계 PRD 문서 → 3단계 [`to-issues`](03_to-issues.md)가 이 PRD를 잘게 쪼갬.
