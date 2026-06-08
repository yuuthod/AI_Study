# superpowers `/brainstorming` 스킬 원문

> **출처**: `~/.claude-river/plugins/cache/claude-plugins-official/superpowers/5.1.0/skills/brainstorming/SKILL.md`  
> **버전**: superpowers 5.1.0  
> **제작자**: superpowers (Anthropic 공식 플러그인)  
> **총 줄 수**: 165줄

---

## 스킬 메타데이터[^1]

```yaml
name: brainstorming
description: "You MUST use this before any creative work - creating features, 
  building components, adding functionality, or modifying behavior. 
  Explores user intent, requirements and design before implementation."
```

---

## 원문 전체

### 제목 및 핵심 목적

```markdown
# Brainstorming Ideas Into Designs

Help turn ideas into fully formed designs and specs through natural 
collaborative dialogue.

Start by understanding the current project context, then ask questions 
one at a time to refine the idea. Once you understand what you're building, 
present the design and get user approval.
```

**한국어 번역:**  
아이디어를 자연스러운 협업 대화를 통해 완성된 설계와 스펙[^2]으로 발전시키세요. 현재 프로젝트 맥락을 이해하는 것으로 시작하고, 아이디어를 다듬기 위해 질문을 하나씩 하세요. 무엇을 만들지 이해하면 설계를 제시하고 사용자의 승인을 받으세요.

---

### HARD GATE (엄격한 제한)

```markdown
<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, 
or take any implementation action until you have presented a design and the 
user has approved it. This applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>
```

**핵심**: 설계를 제시하고 사용자가 승인할 때까지 **어떤 코드도 작성 금지**.

---

### 안티패턴[^3] 경고

```markdown
## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A todo list, a single-function utility, 
a config change — all of them. "Simple" projects are where unexamined assumptions 
cause the most wasted work.
```

**핵심 메시지**: 아무리 단순해 보여도 설계 과정을 생략하지 말 것. 단순한 프로젝트에서 검토되지 않은 가정이 가장 많은 낭비를 초래.

---

### 체크리스트 (순서 준수 필수)

```markdown
## Checklist

You MUST create a task for each of these items and complete them in order:

1. **Explore project context** — check files, docs, recent commits
2. **Offer visual companion** (if topic will involve visual questions)
3. **Ask clarifying questions** — one at a time, understand purpose/constraints/success criteria
4. **Propose 2-3 approaches** — with trade-offs and your recommendation
5. **Present design** — in sections scaled to their complexity, get user approval after each section
6. **Write design doc** — save to docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md and commit
7. **Spec self-review** — quick inline check for placeholders, contradictions, ambiguity, scope
8. **User reviews written spec** — ask user to review the spec file before proceeding
9. **Transition to implementation** — invoke writing-plans skill to create implementation plan
```

---

### 프로세스 플로우 다이어그램

원문의 다이어그램을 한국어로 재현:

```
프로젝트 컨텍스트 탐색
        ↓
비주얼 질문이 예상되나?
  ├─ 예 → 비주얼 컴패니언 제안 (별도 메시지)
  └─ 아니오 ┐
             ↓
      명확화 질문 (하나씩)
             ↓
      2~3가지 접근법 제안
             ↓
      설계 섹션 제시
             ↓
      사용자가 승인했나?
  ├─ 아니오 → 수정 후 재제시
  └─ 예 → 설계 문서 작성
             ↓
      스펙 자체 검토 (인라인 수정)
             ↓
      사용자 스펙 검토?
  ├─ 변경 요청 → 문서 수정
  └─ 승인 → writing-plans 스킬 호출
```

**터미널 상태**: `writing-plans` 스킬 호출. 다른 어떤 구현 스킬도 호출 금지.

---

### 핵심 프로세스 가이드라인

#### 아이디어 이해하기

```markdown
- Check out the current project state first (files, docs, recent commits)
- Before asking detailed questions, assess scope: if the request describes 
  multiple independent subsystems, flag this immediately.
- For appropriately-scoped projects, ask questions one at a time to refine the idea
- Prefer multiple choice questions when possible
- Only one question per message
- Focus on understanding: purpose, constraints, success criteria
```

**중요 규칙**: 요청이 여러 독립적인 하위 시스템을 포함한다면 즉시 분해[^4]를 제안할 것.

#### 접근법 탐색하기

```markdown
- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why
```

#### 설계 제시하기

```markdown
- Once you believe you understand what you're building, present the design
- Scale each section to its complexity
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
```

#### 격리와 명확성을 위한 설계

```markdown
- Break the system into smaller units that each have one clear purpose, 
  communicate through well-defined interfaces, and can be understood 
  and tested independently
- Can someone understand what a unit does without reading its internals?
- Can you change the internals without breaking consumers? If not, 
  the boundaries need work.
```

---

### 설계 이후 단계

#### 문서화

```markdown
- Write the validated design (spec) to docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md
- Commit the design document to git
```

#### 스펙 자체 검토 (4가지 항목)

```markdown
1. **Placeholder scan**: Any "TBD", "TODO", incomplete sections? Fix them.
2. **Internal consistency**: Do any sections contradict each other?
3. **Scope check**: Is this focused enough for a single implementation plan?
4. **Ambiguity check**: Could any requirement be interpreted two different ways?
```

#### 사용자 검토 게이트[^5]

```markdown
> "Spec written and committed to <path>. Please review it and let me know 
if you want to make any changes before we start writing out the 
implementation plan."
```

사용자가 승인할 때까지 대기. 변경 요청 시 수정 후 재검토.

---

### 핵심 원칙

```markdown
## Key Principles

- **One question at a time** - Don't overwhelm with multiple questions
- **Multiple choice preferred** - Easier to answer than open-ended when possible
- **YAGNI ruthlessly** - Remove unnecessary features from all designs
- **Explore alternatives** - Always propose 2-3 approaches before settling
- **Incremental validation** - Present design, get approval before moving on
- **Be flexible** - Go back and clarify when something doesn't make sense
```

---

### 비주얼 컴패니언 기능

```markdown
## Visual Companion

A browser-based companion for showing mockups, diagrams, and visual options 
during brainstorming.

**Offering the companion:** When you anticipate that upcoming questions will 
involve visual content (mockups, layouts, diagrams), offer it once for consent.

**Per-question decision:** Even after the user accepts, decide FOR EACH QUESTION 
whether to use the browser or the terminal.

- **Use the browser** for content that IS visual — mockups, wireframes, layouts
- **Use the terminal** for content that is text — requirements questions, tradeoffs
```

---

## 스킬 특징 요약

| 항목 | 내용 |
|------|------|
| **길이** | 165줄 |
| **복잡도** | 중간 |
| **목적** | 아이디어 → 설계 → 구현 계획 전환 |
| **방식** | 체크리스트 기반 단계적 진행 |
| **종료 조건** | `writing-plans` 스킬 호출 |
| **출력물** | 스펙 문서 (git 커밋 포함) |
| **YAGNI[^6]** | 명시적으로 강조 |

---

## 이 스킬이 가장 잘 맞는 상황

- 새로운 기능을 추가하기 **전에** 요구사항을 명확히 하고 싶을 때
- 여러 구현 방식 중 **어떤 것이 최선인지** 함께 탐색하고 싶을 때
- 충분한 설계 없이 바로 코딩하는 **나쁜 습관**을 방지하고 싶을 때
- 설계 문서를 **체계적으로** 관리하고 싶을 때

---

[^1]: **메타데이터(Metadata)**: 스킬 자체를 설명하는 정보. 이름, 설명, 발동 조건 등이 포함.
[^2]: **스펙(Spec)**: Specification의 약자. 소프트웨어가 무엇을 해야 하는지, 어떻게 동작해야 하는지를 구체적으로 기술한 문서.
[^3]: **안티패턴(Anti-pattern)**: 반복적으로 나타나지만 실제로는 역효과를 내는 설계 방식. 여기서는 "너무 단순해서 설계가 필요 없다"는 잘못된 생각.
[^4]: **분해(Decomposition)**: 큰 시스템을 독립적으로 개발 가능한 작은 단위로 나누는 것. 각 단위를 별도의 스펙과 구현 사이클로 처리.
[^5]: **게이트(Gate)**: 다음 단계로 진행하기 전에 반드시 통과해야 하는 검증 지점. 여기서는 사용자의 명시적 승인이 필요.
[^6]: **YAGNI(You Aren't Gonna Need It)**: "어차피 필요하지 않을 것"이라는 소프트웨어 개발 원칙. 현재 필요하지 않은 기능은 미리 만들지 말라는 뜻.
