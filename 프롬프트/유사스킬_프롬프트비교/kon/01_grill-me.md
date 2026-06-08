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

## 용도

계획이나 설계를 철저히 검증할 때 사용. 사용자가 제시한 플랜에 대해 질문을 하나씩 던지며, 결정 트리의 각 분기를 순서대로 해결해 나가는 인터뷰 방식의 스킬.

## 동작 방식

- 플랜/설계의 모든 측면에 대해 집요하게 질문
- 질문은 한 번에 하나씩 진행
- 각 질문마다 추천 답변도 함께 제시
- 코드베이스에서 답을 찾을 수 있는 질문은 직접 탐색해서 해결

## 트리거 조건

사용자가 플랜 검증을 원할 때, 설계에 대한 stress-test를 원할 때, 또는 "grill me"를 언급할 때.

## 참고

비슷한 스킬로 `grill-with-docs`도 있는데, 이쪽은 기존 도메인 모델/문서(CONTEXT.md, ADR 등)를 기반으로 그릴링하는 버전입니다.
