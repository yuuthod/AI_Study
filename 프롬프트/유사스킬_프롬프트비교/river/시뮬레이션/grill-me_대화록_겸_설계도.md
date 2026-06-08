# `/grill-me` 시뮬레이션 — 대화록 겸 설계도

> **스킬**: mattpock `/grill-me`  
> **특징**: 별도 설계 문서를 생성하지 않으므로, 대화 진행과 동시에 설계 결정을 기록하여 최종 설계도로 조립

---

## 시작 프롬프트

> 데스크탑 프로그램 사용 시간 관리 앱을 만들려고 해. 내가 codex나 chatgpt 같은 사이트에 들어있으면 생산적인 일을 하는 것이고, youtube나 instagram을 보고 있으면 비생산적인 일을 하고 있는 거야. 나중에 mac에서도 출시하려고 하는데 이번에는 windows 먼저 만들고 싶어.

---

## 질의응답 기록

---

### Q1. 추적 범위

**🤖 AI 질문:**
앱의 추적 범위를 어떻게 정의할까요? 브라우저 탭의 URL만 추적할 것인지, 아니면 VS Code, Notion, Slack처럼 브라우저 외 앱의 이름까지 추적할 것인지 결정해야 합니다.

> **AI 추천 답**: 브라우저 URL + 앱 이름 모두 추적  
> 이유: 생산성 측정은 "어떤 사이트를 보는가"만큼 "어떤 앱을 쓰는가"도 중요하며, VS Code(생산적) vs Steam(비생산적) 같은 구분은 URL 없이 앱 이름만으로 충분합니다.

**👤 사용자 답변:**
브라우저 URL이랑 앱 이름 둘 다. VS Code나 터미널은 생산적인 걸로 보고 싶어.

📝 **설계 결정 #1**: 추적 범위 = 브라우저 탭 URL + 모든 앱 프로세스 이름

---

### Q2. Windows에서 URL 추적 방법

**🤖 AI 질문:**
Windows에서 현재 활성 브라우저의 URL을 가져오는 방법은 여러 가지입니다. 어떤 방식이 적합한지 결정해야 합니다.

> **AI 추천 답**: UI Automation API 우선 사용  
> 이유: Chrome, Edge, Firefox의 주소창에서 UI Automation으로 URL을 직접 읽을 수 있습니다. 브라우저 확장은 설치 과정이 추가되어 사용자 경험이 복잡해지고, WinRT 브라우저 API는 Edge에만 한정됩니다. UI Automation이 가장 범용적입니다.

**👤 사용자 답변:**
UI Automation이 좋을 것 같아. 브라우저 확장 설치 안 시키고 싶어.

📝 **설계 결정 #2**: URL 추적 방식 = Windows UI Automation API (SetWinEventHook + AccessibleObject)

---

### Q3. 카테고리 분류 방식

**🤖 AI 질문:**
생산적/비생산적 분류 기준을 어떻게 관리할까요? 사전 정의된 고정 목록, 사용자가 직접 편집하는 목록, 또는 AI가 자동 분류하는 방식 중 선택해야 합니다.

> **AI 추천 답**: 기본 목록 제공 + 사용자 수동 편집  
> 이유: AI 자동 분류는 오분류 가능성이 있고 오프라인 환경에서 작동 불가입니다. 고정 목록은 유연성이 없습니다. 기본 목록(ChatGPT, GitHub = 생산적 / YouTube, Instagram = 비생산적)을 제공하되, 사용자가 규칙을 추가/제거할 수 있는 방식이 최적입니다.

**👤 사용자 답변:**
기본 목록 있고 수동으로 추가/제거 가능하게. GitHub이나 Stack Overflow는 기본적으로 생산적으로 넣어줘.

📝 **설계 결정 #3**: 분류 = 사전 정의 목록(JSON) + UI를 통한 사용자 편집, 기본 생산적 목록에 GitHub, Stack Overflow, Codex, ChatGPT 포함

---

### Q4. 데이터 저장 방식

**🤖 AI 질문:**
사용 기록 데이터를 어디에 어떤 형식으로 저장할까요?

> **AI 추천 답**: SQLite (로컬)  
> 이유: 클라우드는 프라이버시 우려와 추가 인프라 비용이 발생합니다. JSON 파일은 대용량 조회에 비효율적입니다. SQLite는 로컬에서 복잡한 쿼리(시간대별 집계 등)가 가능하며 파일 하나로 관리됩니다. 나중에 클라우드 동기화를 추가하더라도 SQLite를 기반으로 확장하기 쉽습니다.

**👤 사용자 답변:**
로컬만. 클라우드는 나중에 생각할게. SQLite 좋아.

📝 **설계 결정 #4**: 저장소 = SQLite 로컬 파일 (`%APPDATA%/timetracker/data.db`)

---

### Q5. 앱 아키텍처 구조

**🤖 AI 질문:**
앱을 백그라운드 서비스(Windows Service)와 트레이 앱 두 프로세스로 분리할지, 단일 프로세스 트레이 앱으로 만들지 결정해야 합니다.

> **AI 추천 답**: 단일 프로세스 트레이 앱  
> 이유: Windows Service로 분리하면 UAC 권한 처리, 서비스 등록/제거 복잡성, 서비스-UI 간 IPC 구현이 필요합니다. 초기 버전에서는 단일 프로세스로 시작해 트레이 아이콘으로 백그라운드 실행하는 것이 충분합니다. 성능 이슈가 발생하면 나중에 분리할 수 있습니다.

**👤 사용자 답변:**
단일 프로세스로. 처음부터 복잡하게 만들 필요 없을 것 같아.

📝 **설계 결정 #5**: 아키텍처 = 단일 프로세스 (트레이 앱), 시스템 시작 시 자동 실행 옵션 포함

---

### Q6. 크로스플랫폼 기술 스택

**🤖 AI 질문:**
Windows 네이티브(WPF / WinUI 3)로 만들고 나중에 Mac 버전을 별도로 개발할지, 처음부터 Electron으로 크로스플랫폼을 목표로 할지 결정해야 합니다.

> **AI 추천 답**: Electron + TypeScript  
> 이유: Mac 출시 목표가 있다면 처음부터 Electron이 유리합니다. WPF로 만들면 Mac 포팅 시 거의 전체를 다시 작성해야 합니다. Electron은 Windows 트레이 앱, UI Automation 연동, SQLite 연동이 모두 가능하며, React + TypeScript 스택은 생태계가 성숙했습니다. 다만 메모리 사용량이 네이티브 대비 높습니다(Chromium 내장으로 약 150-200MB).

**👤 사용자 답변:**
Electron으로 가자. 나중에 Mac 지원할 거니까. TypeScript + React 좋아.

📝 **설계 결정 #6**: 기술 스택 = Electron + TypeScript + React, `electron-builder`로 패키징

---

### Q7. UI 구조

**🤖 AI 질문:**
앱의 UI를 트레이 아이콘 + 팝업 메뉴로만 구성할지, 별도의 대시보드 창을 둘지 결정해야 합니다.

> **AI 추천 답**: 트레이 아이콘 + 별도 대시보드 창  
> 이유: 트레이만으로는 상세 통계(주간 차트, 카테고리 관리 등)를 보여주기 어렵습니다. 트레이 아이콘은 오늘 요약(생산적 X시간 / 비생산적 Y시간)을 표시하는 빠른 뷰로, 대시보드 창은 상세 분석과 설정을 위한 공간으로 역할을 분리하면 사용성이 좋습니다.

**👤 사용자 답변:**
트레이 아이콘에서 오늘 요약 보이고, 클릭하면 대시보드 창 열리는 거. 그렇게 하자.

📝 **설계 결정 #7**: UI = 트레이 아이콘(오늘 요약 툴팁) + 대시보드 창(차트, 카테고리 설정, 히스토리)

---

### Q8. 알림 시스템

**🤖 AI 질문:**
비생산적 사이트에서 너무 오래 있을 때 어떤 방식으로 알릴까요?

> **AI 추천 답**: Windows 토스트 알림 + 일일 요약 리포트  
> 이유: 실시간 경고만 있으면 짜증스러울 수 있습니다. 설정 가능한 임계값(예: YouTube 30분 초과 시 알림) + 하루 마감 시 총 생산성 요약 알림 조합이 행동 변화에 효과적입니다.

**👤 사용자 답변:**
YouTube 30분 넘으면 알림 뜨게 하고, 저녁 8시에 일일 요약. 임계값은 설정 가능하게.

📝 **설계 결정 #8**: 알림 = Windows 토스트 알림 (임계값 초과 시) + 매일 설정 시간에 일일 요약, 모두 설정 가능

---

### Q9. 데이터 보존 기간

**🤖 AI 질문:**
사용 기록 데이터를 얼마나 오래 보관할까요? 오래 보관할수록 DB 파일이 커집니다.

> **AI 추천 답**: 기본 90일, 최대 1년, 설정 가능  
> 이유: 주간/월간 트렌드 분석을 위해서는 최소 30일이 필요합니다. 기본값을 90일로 설정하고, 사용자가 늘리거나 줄일 수 있게 하는 것이 적절합니다. 1년치 데이터도 SQLite에서 몇 MB 수준으로 문제 없습니다.

**👤 사용자 답변:**
기본 90일로 하자. 설정에서 바꿀 수 있게.

📝 **설계 결정 #9**: 데이터 보존 = 기본 90일, 설정 가능 (30일 / 90일 / 180일 / 1년)

---

### Q10. Mac 이식 전략

**🤖 AI 질문:**
Mac 버전 출시 시 URL 추적 방법이 달라집니다. Windows의 UI Automation이 Mac에서는 Accessibility API로 대체됩니다. Mac 지원을 위한 추상화 레이어를 지금 설계에 반영할까요?

> **AI 추천 답**: 지금 추상화 레이어 포함  
> 이유: Electron 앱이라도 플랫폼별 네이티브 기능(트레이, 알림, 창 추적)은 다릅니다. `platform-service`라는 인터페이스를 만들고 `WindowsTrackerService`, `MacTrackerService`로 구현하면 나중에 Mac 지원 시 플랫폼 레이어만 추가하면 됩니다. 지금 하지 않으면 나중에 리팩토링 비용이 큽니다.

**👤 사용자 답변:**
맞아, 처음부터 추상화 해두자. 나중에 힘들어지니까.

📝 **설계 결정 #10**: 플랫폼 추상화 = `PlatformTrackerService` 인터페이스, Windows/Mac 구현 분리

---

## ✅ 공유된 이해 도달 — 설계 결정 요약

| # | 결정 사항 | 선택 |
|---|----------|------|
| 1 | 추적 범위 | 브라우저 URL + 모든 앱 이름 |
| 2 | URL 추적 방식 | UI Automation API |
| 3 | 카테고리 분류 | 기본 목록 + 사용자 수동 편집 |
| 4 | 데이터 저장 | SQLite 로컬 |
| 5 | 앱 아키텍처 | 단일 프로세스 트레이 앱 |
| 6 | 기술 스택 | Electron + TypeScript + React |
| 7 | UI 구조 | 트레이 아이콘 + 대시보드 창 |
| 8 | 알림 | 토스트 알림 + 일일 요약 |
| 9 | 데이터 보존 | 기본 90일, 설정 가능 |
| 10 | 플랫폼 추상화 | PlatformTrackerService 인터페이스 |

---

---

# 📄 조립된 설계도

> grill-me는 별도 문서를 생성하지 않으므로, 위 결정들을 조립하여 설계도 형성

---

## 프로젝트: FocusTrack — Windows 데스크탑 생산성 시간 관리 앱

**생성**: `/grill-me` 시뮬레이션  
**날짜**: 2026-06-05  
**플랫폼**: Windows 우선, Mac 추후

---

### 목적

사용자가 어떤 앱/사이트에 시간을 쓰는지 추적하여 생산적 활동과 비생산적 활동을 구분하고, 행동 변화를 유도하는 데스크탑 앱.

---

### 기술 스택

| 레이어 | 선택 | 이유 |
|--------|------|------|
| 프레임워크 | Electron | Windows/Mac 크로스플랫폼 |
| 언어 | TypeScript | 타입 안전성 |
| UI | React | 성숙한 생태계 |
| DB | SQLite (`better-sqlite3`) | 로컬, 빠른 집계 |
| 패키징 | electron-builder | 인스톨러 생성 |
| 네이티브 | Node.js N-API 모듈 | UI Automation 연동 |

---

### 아키텍처

```
[Electron Main Process]
  ├── PlatformTrackerService (인터페이스)
  │   └── WindowsTrackerService (구현)
  │       ├── SetWinEventHook — 활성 창 변경 감지
  │       └── UI Automation — 브라우저 URL 읽기
  ├── TrackingEngine
  │   ├── 매 1초마다 활성 앱/URL 폴링
  │   └── 5초 이상 동일 항목 → DB 기록
  ├── CategoryService
  │   ├── categories.json 로드
  │   └── URL/앱 이름으로 생산적/비생산적 판별
  ├── SQLiteStore
  │   └── sessions 테이블 (app, url, category, start, end)
  ├── NotificationService
  │   ├── 임계값 초과 시 Windows 토스트 알림
  │   └── 일일 요약 스케줄러 (node-cron)
  └── TrayManager
      └── 트레이 아이콘, 오늘 요약 툴팁

[Electron Renderer Process — React]
  ├── DashboardWindow
  │   ├── 오늘 통계 (생산적 N시간 / 비생산적 M시간)
  │   ├── 주간 트렌드 차트 (recharts)
  │   ├── 앱/사이트별 상세 목록
  │   └── 카테고리 관리 (추가/편집/삭제)
  └── SettingsWindow
      ├── 알림 임계값 설정
      ├── 일일 요약 시간 설정
      ├── 데이터 보존 기간
      └── 시작 시 자동 실행
```

---

### 데이터 모델 (SQLite)

```sql
-- 추적 세션
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_name TEXT NOT NULL,        -- 예: "chrome.exe"
  window_title TEXT,             -- 예: "YouTube - Google Chrome"
  url TEXT,                      -- 예: "youtube.com/watch?v=..."
  category TEXT NOT NULL,        -- "productive" | "unproductive" | "neutral"
  started_at INTEGER NOT NULL,   -- Unix timestamp (ms)
  ended_at INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL
);

-- 카테고리 규칙
CREATE TABLE category_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pattern TEXT NOT NULL,         -- 예: "youtube.com", "chrome.exe"
  pattern_type TEXT NOT NULL,    -- "url_domain" | "app_name"
  category TEXT NOT NULL,
  is_default INTEGER DEFAULT 0
);
```

---

### 기본 카테고리 목록

**생산적 (기본 포함)**
- 도메인: `github.com`, `stackoverflow.com`, `chat.openai.com`, `codex.google.com`, `notion.so`, `figma.com`, `linear.app`
- 앱: `code.exe` (VS Code), `cursor.exe`, `windowsterminal.exe`, `rider64.exe`

**비생산적 (기본 포함)**
- 도메인: `youtube.com`, `instagram.com`, `twitter.com`, `reddit.com`, `tiktok.com`, `netflix.com`
- 앱: `steam.exe`

---

### 알림 규칙

| 트리거 | 기본값 | 설명 |
|--------|--------|------|
| 비생산적 연속 사용 | 30분 | "YouTube에서 30분 이상 사용 중입니다" |
| 일일 비생산적 누적 | 2시간 | "오늘 비생산적 활동에 2시간 사용했습니다" |
| 일일 요약 | 저녁 8:00 | 오늘 생산적/비생산적 총 시간 요약 |

---

### 플랫폼 추상화

```typescript
interface PlatformTrackerService {
  getActiveWindow(): Promise<ActiveWindowInfo>;
  getActiveBrowserUrl(windowHandle: number): Promise<string | null>;
  onWindowChange(callback: (info: ActiveWindowInfo) => void): () => void;
}

interface ActiveWindowInfo {
  appName: string;
  windowTitle: string;
  processId: number;
  windowHandle: number;
}

// Windows 구현
class WindowsTrackerService implements PlatformTrackerService { ... }

// Mac 구현 (추후)
class MacTrackerService implements PlatformTrackerService { ... }
```

---

### Mac 이식 계획

Windows 버전 완성 후 Mac 추가 시:
1. `MacTrackerService` 구현 (Accessibility API + `osascript` for URL)
2. `electron-builder` macOS 타깃 추가
3. macOS Notarization 설정
4. 트레이 아이콘 macOS 스타일 조정

---

### 배포 계획

- **Windows**: NSIS 인스톨러 (`.exe`) + Windows Store (추후)
- **자동 업데이트**: `electron-updater` + GitHub Releases
- **코드 서명**: Windows Authenticode 서명 (Defender 경고 방지)
