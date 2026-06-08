# mattpock `/grill-me` 스킬 원문

> **출처**: `~/.claude-river/skills/grill-me/SKILL.md`  
> **버전**: 명시 없음  
> **제작자**: mattpock  
> **총 줄 수**: 11줄

---

## 스킬 메타데이터[^1]

```yaml
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching 
  shared understanding, resolving each branch of the decision tree. Use when user 
  wants to stress-test a plan, get grilled on their design, or mentions "grill me".
```

---

## 원문 전체 (번역 포함)

### 영어 원문

```
Interview me relentlessly about every aspect of this plan until we reach a shared 
understanding. Walk down each branch of the design tree, resolving dependencies 
between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.
```

### 한국어 번역

```
우리가 공유된 이해에 도달할 때까지 이 계획의 모든 측면에 대해 
집요하게 인터뷰하세요. 결정들 사이의 의존성[^2]을 하나씩 해결하면서 
설계 트리[^3]의 각 분기를 따라 내려가세요. 각 질문에 대해 
당신이 추천하는 답을 제공하세요.

질문은 한 번에 하나씩 하세요.

질문이 코드베이스를 탐색함으로써 답할 수 있다면, 
대신 코드베이스를 탐색하세요.
```

---

## 스킬 분석

### 핵심 동작 원리

이 스킬은 단 3개의 문장으로 구성되어 있지만, 그 안에는 명확한 철학이 담겨 있습니다.

```
[규칙 1] 집요하게 인터뷰하라
         ↓
[규칙 2] 설계 트리의 모든 분기를 따라가며 의존성을 해결하라
         ↓
[규칙 3] 각 질문에 AI의 추천 답을 함께 제시하라
         ↓
[규칙 4] 질문은 반드시 하나씩
         ↓
[규칙 5] 코드베이스로 답할 수 있으면 직접 탐색하라
```

### 설계 트리(Decision Tree) 탐색

스킬의 핵심은 **설계 트리(design tree)** 개념입니다. 모든 설계 결정은 트리 구조를 형성하며, 상위 결정이 하위 결정에 영향을 줍니다.

```
루트: "무엇을 만들까?"
├── 분기 A: "어떤 데이터베이스를 쓸까?"
│   ├── 분기 A-1: "스키마[^4]는 어떻게 할까?"
│   └── 분기 A-2: "마이그레이션[^5] 전략은?"
└── 분기 B: "인증은 어떻게 할까?"
    ├── 분기 B-1: "세션 방식 vs JWT[^6]?"
    └── 분기 B-2: "소셜 로그인은 포함할까?"
```

grill-me는 이 트리를 **체계적으로** 탐색하여 모든 결정을 명시적으로 해결합니다.

### 추천 답 제시의 의미

단순한 질문만 하는 것이 아니라, AI가 **자신의 추천 답**을 먼저 제시합니다. 이는:
- 사용자가 빈 종이 앞에서 막히는 것을 방지
- AI의 전문 지식을 적극 활용
- 사용자가 동의/반대/수정할 수 있는 출발점 제공

---

## 스킬 특징 요약

| 항목 | 내용 |
|------|------|
| **길이** | 11줄 (메타데이터 포함) |
| **복잡도** | 매우 낮음 |
| **목적** | 계획/설계의 공유 이해 도달 |
| **방식** | 집요한 질문 + AI 추천 답 제시 |
| **종료 조건** | "공유된 이해"에 도달할 때 |
| **코드베이스 탐색** | 필요시 자동으로 탐색 |
| **출력물** | 없음 (대화가 결과물) |

---

## 이 스킬이 가장 잘 맞는 상황

- 이미 계획이나 설계가 있지만 **구멍이 있는지 검증**하고 싶을 때
- 설계 결정에 대해 **자기 자신과 토론**하고 싶을 때
- PR 리뷰[^7] 전에 **자기 점검**이 필요할 때
- 아키텍처 결정에서 **놓친 것이 없는지** 확인하고 싶을 때

---

[^1]: **메타데이터(Metadata)**: 스킬 자체를 설명하는 정보. 이름, 설명, 트리거 조건 등이 포함.
[^2]: **의존성(Dependency)**: 결정 A가 결정 B에 영향을 미치는 관계. 예: "어떤 언어를 쓸지"가 "어떤 프레임워크를 쓸지"에 영향.
[^3]: **설계 트리(Design tree)**: 설계 결정들이 트리 형태로 연결된 구조. 상위 결정이 하위 결정의 가능성을 제약함.
[^4]: **스키마(Schema)**: 데이터베이스의 테이블 구조, 컬럼, 관계를 정의한 설계도.
[^5]: **마이그레이션(Migration)**: 데이터베이스 스키마를 점진적으로 변경하는 것. 기존 데이터를 보존하면서 구조를 바꾸는 작업.
[^6]: **JWT(JSON Web Token)**: 사용자 인증 정보를 JSON 형태로 인코딩한 토큰. 서버가 세션을 저장하지 않아도 되는 무상태(stateless) 인증 방식.
[^7]: **PR 리뷰(Pull Request Review)**: 코드 변경 사항을 메인 코드베이스에 병합하기 전에 다른 개발자가 검토하는 과정.
