# 1. grill-me — 집요하게 캐묻기

- 출처: [github.com/mattpocock/skills](https://github.com/mattpocock/skills) · `skills/productivity/grill-me/SKILL.md`
- 워크플로우 위치: **1단계** (요구사항 합의)

---

## 원문 (Original)

```markdown
---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.
```

---

## 번역 (Translation)

```markdown
---
name: grill-me
description: 공유된 이해에 도달할 때까지 계획이나 설계에 대해 사용자를 집요하게 인터뷰하고, 의사결정 트리의 각 분기를 해소한다. 사용자가 계획을 압박 테스트하고 싶을 때, 설계에 대해 추궁받고 싶을 때, 또는 "grill me"를 언급할 때 사용한다.
---

우리가 공유된 이해에 도달할 때까지 이 계획의 모든 측면에 대해 나를 집요하게 인터뷰하라. 설계 트리의 각 분기를 따라 내려가며, 결정들 사이의 의존성을 하나씩 해소하라. 각 질문마다 당신의 추천 답변을 함께 제시하라.

질문은 한 번에 하나씩 하라.

만약 어떤 질문이 코드베이스를 탐색해서 답할 수 있는 것이라면, 질문하는 대신 코드베이스를 탐색하라.
```

---

## 해설

### 핵심 동작
- **집요한 인터뷰**: 계획의 모든 측면을 질문으로 분해해 빈틈을 드러냄.
- **의사결정 트리 탐색**: 결정들 사이의 의존성을 하나씩 순서대로 해소.
- **추천 답변 동반**: 각 질문에 AI가 자신의 추천을 함께 제시 → 사용자가 동의/반대/수정으로 빠르게 결정.
- **코드베이스 우선**: 코드로 답할 수 있는 질문은 묻지 않고 직접 탐색.

### 설계 철학 — 최소주의
**단 11줄(frontmatter 포함)**로 핵심 기능을 완성. 하네스(harness)가 거의 없고 나머지는 AI 재량에 위임. 지난 스터디의 결론 — "하네스가 적을수록 하나를 깊게 판다" — 의 대표 사례.

### 맷 포콕의 비유
맷 포콕은 grill-me를 **"러버덕 디버깅(rubber ducking)의 새 버전"**이라 설명합니다. 책상 위 고무 오리에게 문제를 소리 내어 설명하다 보면 스스로 답을 찾게 되는 오래된 개발자 의식 — **다만 이번엔 오리가 되묻는다**는 점이 다릅니다.

> 맷 포콕은 grill-me를 "내 워크플로우에 추가한 단일 최고 ROI 프롬프트"라고 평합니다. 복잡한 기능에서는 한 세션에 30~50개의 질문이 나오기도 합니다.

### 워크플로우 연결
1단계. 여기서 도출된 **공유된 이해**가 다음 단계 [`to-prd`](02_to-prd.md)의 입력이 됩니다.
