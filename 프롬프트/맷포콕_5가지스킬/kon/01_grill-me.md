# 맷 포콕: /grill-me

- 출처: https://github.com/mattpocock/skills
- 위치: `skills/productivity/grill-me/SKILL.md`

## 원문

```
---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.
```

## 원문 해석본

```
---
name: grill-me
description: 공유된 이해에 도달할 때까지 계획이나 설계에 대해 사용자를 끈질기게 인터뷰하고, 의사결정 트리의 각 가지를 해소한다. 사용자가 계획을 stress-test하고 싶을 때, 설계에 대해 그릴링당하고 싶을 때, 또는 "grill me"를 언급할 때 사용한다.
---

이 계획의 모든 측면에 대해 공유된 이해에 도달할 때까지 나를 끈질기게 인터뷰하라. 설계 트리의 각 가지를 따라 내려가며, 결정들 사이의 의존 관계를 하나씩 해소하라. 각 질문마다 너의 추천 답변을 함께 제시하라.

질문은 한 번에 하나씩 던져라.

코드베이스를 탐색해서 답할 수 있는 질문이라면, (묻지 말고) 대신 코드베이스를 탐색하라.
```

## 해석·분석

- 핵심 메커니즘은 **"decision tree를 한 가지씩 해소"** — 한꺼번에 질문을 쏟지 않고, 앞 결정이 뒤 결정의 전제가 되는 의존 관계를 따라 순차적으로 좁힌다.
- **"추천 답변을 항상 제시"** 가 중요하다. 단순 심문이 아니라 AI가 먼저 입장을 내고 사용자가 반박/승인하게 만들어 인지 부하를 낮춘다.
- **"코드로 답할 수 있으면 코드를 봐라"** — 이미 코드에 답이 있는 질문으로 시간 낭비하지 않게 하는 안전장치.
- 가장 가볍고 범용적인 스킬. 프로젝트 문서나 코드 구조에 의존하지 않는다.

## 트리거 조건

계획을 stress-test하고 싶을 때, 설계에 대해 그릴링당하고 싶을 때, 또는 "grill me"를 언급할 때.

## 참고

상위 호환·엔지니어링 특화 버전으로 [02_grill-with-docs.md](02_grill-with-docs.md)가 있다. 이쪽은 기존 도메인 모델/문서(CONTEXT.md, ADR)를 기반으로 그릴링한다.
