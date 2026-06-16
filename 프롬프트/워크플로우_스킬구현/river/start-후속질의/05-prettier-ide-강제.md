# Q5. Prettier가 IDE마다 다르게 동작하지 않게 강제

> 질문: VSCode 등 IDE에서 prettier가 다르게(줄간격·탭 등) 동작하지 않도록 강제할 방법.

## 원리
IDE 설정 = 쾌적함(저장 시 포맷). **보증 = pre-commit + CI**(IDE 무관).

## 4겹 구조
| 층 | 파일 | 역할 |
|---|---|---|
| 에디터 베이스 | .editorconfig (있음) | indent·EOL·charset·final newline |
| VSCode 통일 | .vscode/settings.json (신규) | formatOnSave, 기본 포매터=Prettier, eslint fix on save. 커밋해 공유 |
| 확장 유도 | .vscode/extensions.json (신규) | Prettier·ESLint 확장 설치 권장 |
| 단일 규칙 | .prettierrc (있음) | 위 전부가 참조하는 하나의 설정 |
| 벽(보증) | lint-staged + CI prettier --check | IDE 뭐든 커밋 시 강제, 미포맷 CI 차단 |

## 보강 (발견)
- 현재 CI에 prettier 검사 없음 → `format:check`(prettier --check) 스크립트 + CI 스텝 추가.
- eslint-config-prettier로 eslint·prettier 규칙 충돌 제거.

## 확인 대기 (사용자)
- .vscode/settings.json 커밋(공유) 여부.

## 반영
- 마지막 일괄: .vscode/settings.json + extensions.json 신규, CI에 format:check, eslint-config-prettier 추가.
