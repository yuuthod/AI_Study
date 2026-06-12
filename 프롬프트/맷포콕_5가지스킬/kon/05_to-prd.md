# 맷 포콕: /to-prd

- 출처: https://github.com/mattpocock/skills
- 위치: `skills/engineering/to-prd/SKILL.md`

현재 대화 맥락을 PRD로 변환해 프로젝트 이슈 트래커에 발행한다. **grill 계열과 정반대 모드** — 질문으로 이해를 쥐어짜는 게 아니라, 이미 끝난 이해를 산출물로 굳힌다.

## 원문 (SKILL.md)

````
---
name: to-prd
description: Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to create a PRD from the current context.
---

This skill takes the current conversation context and codebase understanding and produces a PRD. Do NOT interview the user — just synthesize what you already know.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the PRD, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can.

Check with the user that these seams match their expectations.

3. Write the PRD using the template below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label - no need for additional triage.

<prd-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this PRD.

## Further Notes

Any further notes about the feature.

</prd-template>
````

## 원문 해석본 (SKILL.md)

````
---
name: to-prd
description: 현재 대화 맥락을 PRD로 바꿔 프로젝트 이슈 트래커에 발행한다. 사용자가 현재 맥락으로부터 PRD를 만들고 싶을 때 사용한다.
---

이 스킬은 현재 대화 맥락과 코드베이스 이해를 받아 PRD를 산출한다. 사용자를 인터뷰하지 마라 — 이미 아는 것을 종합만 하라.

이슈 트래커와 분류(triage) 라벨 어휘가 너에게 제공되어 있어야 한다 — 없으면 `/setup-matt-pocock-skills`를 실행하라.

## 절차

1. 아직 안 했다면, 레포를 탐색해 코드베이스의 현재 상태를 이해하라. PRD 전반에 프로젝트의 도메인 용어집 어휘를 쓰고, 건드리는 영역의 ADR을 존중하라.

2. 기능을 테스트할 seam을 스케치하라. 새 seam보다 기존 seam을 선호하라. 가능한 가장 높은 seam을 써라. 새 seam이 필요하면, 가능한 가장 높은 지점에 제안하라.

이 seam들이 사용자의 기대와 맞는지 확인하라.

3. 아래 템플릿으로 PRD를 작성한 뒤, 프로젝트 이슈 트래커에 발행하라. `ready-for-agent` 분류 라벨을 붙여라 — 추가 분류는 필요 없다.

<prd-template>

## 문제 진술(Problem Statement)

사용자가 겪고 있는 문제를, 사용자의 관점에서.

## 해결책(Solution)

그 문제의 해결책을, 사용자의 관점에서.

## 사용자 스토리(User Stories)

길게 번호 매긴 사용자 스토리 목록. 각 사용자 스토리는 다음 형식이어야 한다:

1. <행위자>로서, 나는 <기능>을 원한다, 그래서 <이득>을 얻는다
   (As an <actor>, I want a <feature>, so that <benefit>)

<사용자-스토리-예시>
1. 모바일 뱅크 고객으로서, 나는 내 계좌의 잔액을 보고 싶다, 그래서 지출에 대해 더 잘 알고 결정할 수 있다
</사용자-스토리-예시>

이 사용자 스토리 목록은 극도로 광범위하여 기능의 모든 측면을 다뤄야 한다.

## 구현 결정(Implementation Decisions)

내려진 구현 결정들의 목록. 다음을 포함할 수 있다:

- 만들어지거나 수정될 모듈
- 수정될 그 모듈들의 인터페이스
- 개발자로부터의 기술적 명료화
- 아키텍처 결정
- 스키마 변경
- API 계약
- 구체적 상호작용

구체적 파일 경로나 코드 스니펫을 포함하지 마라. 매우 빨리 낡을 수 있다.

예외: 프로토타입이 산문보다 결정을 더 정밀하게 인코딩하는 스니펫(상태 머신, reducer, 스키마, 타입 형태)을 산출했다면, 관련 결정 안에 인라인하고 그것이 프로토타입에서 나왔음을 간략히 적어라. 결정이 풍부한 부분으로만 다듬어라 — 동작하는 데모가 아니라, 중요한 부분만.

## 테스팅 결정(Testing Decisions)

내려진 테스팅 결정들의 목록. 다음을 포함하라:

- 무엇이 좋은 테스트를 만드는지에 대한 설명(구현 세부가 아니라 외부 행동만 테스트)
- 어떤 모듈이 테스트될지
- 테스트의 선행 사례(즉, 코드베이스 내 유사한 종류의 테스트)

## 범위 밖(Out of Scope)

이 PRD의 범위 밖인 것들에 대한 설명.

## 추가 노트(Further Notes)

기능에 대한 그 밖의 노트.

</prd-template>
````

## 해석·분석

- **철학:** 현재 대화 맥락 + 코드베이스 이해를 PRD로 만든다. **사용자를 인터뷰하지 마라 — 이미 아는 것을 종합만 하라.** → grill 계열과 정반대. grill이 이해를 쥐어짜는 단계라면, to-prd는 그 이해가 **끝난 후** 산출물로 굳히는 단계.
- **프로세스:** ① 레포 탐색 + **도메인 용어집** 어휘 사용, ADR 존중 → ② **테스트 seam 스케치**(기존 seam 우선, **가장 높은 seam** 선호 — tdd/diagnose와 동일한 사고), 사용자와 일치 확인 → ③ PRD 발행 + `ready-for-agent` 라벨.
- **PRD 템플릿 통찰:**
  - Problem/Solution 모두 **사용자 관점**.
  - User Stories는 "As an actor, I want feature, so that benefit"의 **아주 길고 망라적인** 리스트.
  - Implementation Decisions에 **파일 경로·코드 스니펫 금지**(금방 낡음). 예외: 프로토타입이 산출한, 산문보다 정밀한 스니펫(상태 머신/reducer/스키마/타입)은 인라인 허용하되 핵심만.
  - Testing Decisions = "좋은 테스트란 외부 행동만 검증"(← tdd 철학과 일치) + prior art.
- **핵심:** PRD를 **"AI 에이전트가 바로 실행할 입력"** 으로 설계. `ready-for-agent` 라벨이 증거이고, 파일 경로 배제·행동 중심 서술도 에이전트 자율 구현을 위함.

## 트리거 조건

현재 대화 맥락으로부터 PRD를 만들고 싶을 때.
