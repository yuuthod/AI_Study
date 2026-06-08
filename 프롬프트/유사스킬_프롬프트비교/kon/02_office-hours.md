# gstack: /office-hours

- 출처: https://github.com/garrytan/gstack
- 위치: `gstack/office-hours/SKILL.md`

## 목적

[YC 방식](02_office-hours_부록.md)으로 아이디어를 진단하고 디자인 문서를 생성하는 스킬입니다. 코드를 작성하지 않고, 디자인 도큐먼트만 출력합니다.

## 자동 트리거 조건

- "brainstorm this", "is this worth building", "help me think through", "office hours"
- 새로운 제품 아이디어, 아직 코드가 없는 개념 탐색, 설계 결정 고민 등

## 두 가지 모드

```
┌────────────┬──────────────────────┬──────────────────────────┐
│    모드    │      언제 사용       │           특징           │
├────────────┼──────────────────────┼──────────────────────────┤
│ Startup    │ 스타트업 창업, 사내  │ 6가지 강제 질문으로 수요 │
│ Mode (2A)  │ 프로젝트             │  현실 진단, 직설적       │
│            │                      │ 피드백                   │
├────────────┼──────────────────────┼──────────────────────────┤
│ Builder    │ 해커톤, 오픈소스,    │ 흥미로운 버전 탐색,      │
│ Mode (2B)  │ 사이드 프로젝트,     │ 즐거움 중심의 협력적     │
│            │ 학습                 │ 접근                     │
└────────────┴──────────────────────┴──────────────────────────┘
```

## 워크플로우 (6단계)

1. **Phase 1: Context Gathering** — CLAUDE.md, git 로그, 코드베이스 파악 후 사용자의 목표 확인
2. **Phase 2A/2B: 질문** — 모드에 따라 AskUserQuestion으로 1:1 문답 (각 질문 후 STOP)
   - Startup: 수요 현실 → 현재 해결책 → 고객 특정 → 최소 기능 → 관찰 → 미래 적합성
   - Builder: 가장 멋진 버전 → 보여줄 대상 → 배포 경로 등
3. **Phase 2.75: Landscape Awareness** — WebSearch로 시장 현황 조사 (프라이버시 게이트 포함)
4. **Phase 3: Premise Challenge** — 전제 도전, 올바른 문제인지 검증
5. **Phase 3.5: Second Opinion** — Codex(또는 Claude 서브에이전트)로 교차 검증 (선택적)
6. **Phase 4: Alternatives Generation** — 최소 2가지 접근법 제안 (minimal viable + ideal architecture)
7. **Phase 5: Design Doc** — `~/.gstack/projects/{slug}/` 에 디자인 문서 저장

## 핵심 특징

- **반사회성 방지 규칙**: 진단 중 "That's interesting", "That could work" 같은 표현 금지, 항상 포지션을 취함
- **도망 방지**: 사용자가 "그냥 해줘"라고 해도 최소 2개 질문은 더 함
- **시각적 와이어프레임**: UI가 있는 경우 HTML 스케치 + 스크린샷 생성
- **이전 세션 기억**: `~/.gstack/projects/` 에 저장된 이전 디자인 문서 참조

## 사용 순서

`/office-hours` → `/plan-ceo-review` → `/plan-eng-review` 순서로 사용하도록 설계되어 있습니다.
