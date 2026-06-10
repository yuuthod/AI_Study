# 3. to-issues — 이슈로 분해하기

- 출처: [github.com/mattpocock/skills](https://github.com/mattpocock/skills) · `skills/engineering/to-issues/SKILL.md`
- 워크플로우 위치: **3단계** (작업 분해)

---

## 원문 (Original)

```markdown
---
name: to-issues
description: Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices. Use when user wants to convert a plan into issues, create implementation tickets, or break down work into issues.
---

# To Issues

Break a plan into independently-grabbable issues using vertical slices (tracer bullets).

## Process

### 1. Gather context
Work from whatever is already in the conversation context. If the user passes an issue reference, fetch it and read its full body and comments.

### 2. Explore the codebase (optional)
Issue titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

### 3. Draft vertical slices
Break the plan into tracer bullet issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

Slices may be 'HITL' or 'AFK'. HITL slices require human interaction. AFK slices can be implemented and merged without human interaction. Prefer AFK over HITL where possible.

- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones

### 4. Quiz the user
Present the proposed breakdown as a numbered list. For each slice show: Title, Type (HITL/AFK), Blocked by, User stories covered.
Ask: granularity right? dependencies correct? merge/split? HITL/AFK correct? Iterate until approved.

### 5. Publish the issues to the issue tracker
Publish in dependency order (blockers first). Use the issue body template.
Do NOT close or modify any parent issue.
```

### 이슈 템플릿 (원문)

```markdown
## Parent
A reference to the parent issue (if any).

## What to build
A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation.

## Acceptance criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by
A reference to the blocking ticket, or "None - can start immediately".
```

---

## 번역 (Translation)

```markdown
---
name: to-issues
description: 계획, 스펙, 또는 PRD를 트레이서 불릿 수직 슬라이스를 이용해 독립적으로 집어갈 수 있는 이슈들로 분해한다. 사용자가 계획을 이슈로 변환하거나, 구현 티켓을 만들거나, 작업을 이슈로 쪼개고 싶을 때 사용한다.
---

# To Issues

계획을 수직 슬라이스(트레이서 불릿)를 이용해 독립적으로 집어갈 수 있는 이슈들로 분해한다.

## 프로세스

### 1. 맥락 수집
대화 맥락에 이미 있는 것에서 작업한다. 사용자가 이슈 참조를 넘기면, 그것을 가져와 본문과 댓글 전체를 읽는다.

### 2. 코드베이스 탐색 (선택)
이슈 제목과 설명은 프로젝트의 도메인 용어집을 사용하고, 건드리는 영역의 ADR을 존중해야 한다.

### 3. 수직 슬라이스 초안 작성
계획을 트레이서 불릿 이슈들로 분해한다. 각 이슈는 한 계층만의 수평 슬라이스가 아니라, 모든 통합 계층을 끝에서 끝까지 관통하는 얇은 수직 슬라이스다.

슬라이스는 'HITL' 또는 'AFK'일 수 있다. HITL은 사람의 개입이 필요하고, AFK는 사람 개입 없이 구현·병합 가능하다. 가능하면 AFK를 선호한다.

- 각 슬라이스는 모든 계층(스키마, API, UI, 테스트)을 관통하는 좁지만 완전한 경로를 제공한다
- 완성된 슬라이스는 그 자체로 시연·검증 가능하다
- 두꺼운 슬라이스 몇 개보다 얇은 슬라이스 여러 개를 선호한다

### 4. 사용자에게 퀴즈
제안한 분해를 번호 목록으로 제시한다. 각 슬라이스마다: 제목, 유형(HITL/AFK), 차단 관계, 관련 사용자 스토리.
질문: 입자도가 맞나? 의존 관계가 맞나? 합치거나 더 쪼갤까? HITL/AFK 구분이 맞나? 승인될 때까지 반복.

### 5. 이슈를 이슈 트래커에 발행
의존성 순서(차단하는 것 먼저)로 발행한다. 이슈 본문 템플릿을 사용한다.
부모 이슈는 닫거나 수정하지 말 것.
```

### 이슈 템플릿 (번역)

- **부모(Parent)**: 부모 이슈 참조 (있으면)
- **무엇을 만들까(What to build)**: 이 수직 슬라이스의 간결한 설명. 계층별 구현이 아니라 **끝에서 끝까지의 행위**를 기술
- **수용 기준(Acceptance criteria)**: 체크박스 목록
- **차단 관계(Blocked by)**: 선행 티켓 참조, 또는 "None - 즉시 시작 가능"

---

## 해설

### 핵심 개념 1 — 수직 슬라이스 (트레이서 불릿)
가장 중요한 개념. 작업을 쪼갤 때 **계층별(수평)**로 쪼개지 말고 **기능별(수직)**로 쪼갠다.

```
❌ 수평 슬라이스          ✅ 수직 슬라이스 (트레이서 불릿)
   [스키마 전체]            [기능A: 스키마+API+UI+테스트]
   [API 전체]              [기능B: 스키마+API+UI+테스트]
   [UI 전체]               [기능C: 스키마+API+UI+테스트]
   [테스트 전체]
```

- **트레이서 불릿(tracer bullet)**: 예광탄. 끝에서 끝까지 관통하는 가장 얇은 한 줄기를 먼저 쏴서 경로 전체가 작동함을 증명.
- 각 슬라이스는 **그 자체로 시연·병합 가능** → AFK 에이전트가 독립적으로 집어갈 수 있음.

### 핵심 개념 2 — HITL vs AFK
- **HITL** (Human-In-The-Loop): 사람 개입 필요 (아키텍처 결정, 디자인 리뷰 등)
- **AFK** (Away From Keyboard): 사람 없이 에이전트가 자율 구현·병합 가능
- 원칙: **가능하면 AFK 선호** → AI 에이전트 자동화 극대화.

### 맷 포콕 스킬군의 지향점
이 스킬은 "AI 에이전트 플릿(fleet)"을 염두에 둔 설계입니다. 잘 쪼갠 AFK 이슈는 여러 에이전트가 병렬로 집어가 구현할 수 있습니다. **잘 정의된 프로세스와 깨끗한 코드베이스가 AI 코드 품질의 핵심 지렛대**라는 철학의 구체적 실천.

### 워크플로우 연결
2단계 PRD → 3단계 수직 슬라이스 이슈들 → 각 이슈를 4단계 [`tdd`](04_tdd.md)로 구현.
