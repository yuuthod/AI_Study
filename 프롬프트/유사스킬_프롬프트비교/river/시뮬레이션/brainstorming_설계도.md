# FocusTrack — 설계 스펙

> 생성: superpowers `/brainstorming`  
> 날짜: 2026-06-05  
> 경로: `docs/superpowers/specs/2026-06-05-focustrack-design.md`  
> 상태: APPROVED

---

## 목적과 성공 기준

**목적**: 개발자가 하루 중 생산적/비생산적 활동에 소비하는 시간을 자동으로 추적하고 시각화하여, 생산성 패턴 파악과 행동 변화를 지원하는 Windows 데스크탑 앱.

**성공 기준**:
- 설치 후 설정 없이 바로 추적 시작 가능
- Chrome, Edge에서 현재 탭 URL 추적 정확도 95% 이상
- 트레이 아이콘에서 오늘 생산적/비생산적 시간 즉시 확인 가능
- 일일 요약 알림이 설정된 시간에 정확히 전송
- 개발자 친구 3명이 설치 후 1주 이상 지속 사용

---

## 아키텍처

### 컴포넌트 구조

```
focustrack/
├── src/
│   ├── main/                          # Electron Main Process
│   │   ├── platform/
│   │   │   ├── PlatformTrackerService.ts  # 인터페이스
│   │   │   ├── WindowsTrackerService.ts   # Windows 구현
│   │   │   └── MacTrackerService.ts       # Mac 구현 (추후)
│   │   ├── core/
│   │   │   ├── TrackingEngine.ts          # 폴링 + 세션 관리
│   │   │   ├── CategoryService.ts         # 분류 로직
│   │   │   └── NotificationService.ts     # 알림
│   │   ├── store/
│   │   │   └── SQLiteStore.ts             # DB 접근
│   │   └── tray/
│   │       └── TrayManager.ts             # 트레이 아이콘
│   ├── renderer/                      # React UI
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── CategoryManager/
│   │   │   └── Settings/
│   │   └── App.tsx
│   └── shared/
│       └── types.ts                   # 공유 타입 정의
├── assets/
│   └── categories.json                # 기본 카테고리 목록
└── electron-builder.config.ts
```

### 인터페이스 정의

```typescript
// 플랫폼 추상화 인터페이스
interface PlatformTrackerService {
  getActiveWindow(): Promise<ActiveWindowInfo>;
  getActiveBrowserUrl(windowHandle: number): Promise<string | null>;
  onWindowChange(callback: (info: ActiveWindowInfo) => void): Unsubscribe;
  dispose(): void;
}

interface ActiveWindowInfo {
  appName: string;          // 예: "chrome.exe"
  windowTitle: string;      // 예: "YouTube - Google Chrome"
  processId: number;
  windowHandle: number;
}

// 세션 타입
interface TrackingSession {
  id?: number;
  appName: string;
  windowTitle: string;
  url: string | null;
  category: 'productive' | 'unproductive' | 'neutral';
  startedAt: number;        // Unix timestamp (ms)
  endedAt: number;
  durationMs: number;
}

// 카테고리 규칙
interface CategoryRule {
  id?: number;
  pattern: string;          // 예: "youtube.com", "code.exe"
  patternType: 'url_domain' | 'app_name';
  category: 'productive' | 'unproductive' | 'neutral';
  isDefault: boolean;
}
```

---

## 데이터 모델

### SQLite 스키마

```sql
-- 추적 세션 기록
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_name TEXT NOT NULL,
  window_title TEXT,
  url TEXT,
  category TEXT NOT NULL CHECK(category IN ('productive', 'unproductive', 'neutral')),
  started_at INTEGER NOT NULL,
  ended_at INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL
);

CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_sessions_category ON sessions(category);

-- 카테고리 분류 규칙
CREATE TABLE category_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pattern TEXT NOT NULL,
  pattern_type TEXT NOT NULL CHECK(pattern_type IN ('url_domain', 'app_name')),
  category TEXT NOT NULL,
  is_default INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch() * 1000)
);

-- 앱 설정
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

---

## 데이터 플로우

```
SetWinEventHook 이벤트 발생
    ↓
WindowsTrackerService.getActiveWindow()
    → 앱 이름, 창 제목, 프로세스 ID 반환
    ↓
브라우저인 경우: UI Automation API로 URL 읽기
    → 실패 시 (Firefox 등): null 반환, 앱 이름만 사용
    ↓
TrackingEngine.onWindowChange()
    → 동일 앱/URL이 5초(기본값, 1~30초 설정 가능) 이상 유지되면:
    ↓
CategoryService.classify(appName, url)
    → categories.json에서 패턴 매칭
    → 매칭 없으면 'neutral' 반환
    ↓
SQLiteStore.saveSession(session)
    ↓
NotificationService.checkThresholds()
    → 임계값 초과 시: Windows 토스트 알림 발송
```

---

## 기본 카테고리 목록

### 생산적 (productive)

| 패턴 | 유형 |
|------|------|
| `github.com` | url_domain |
| `stackoverflow.com` | url_domain |
| `chat.openai.com` | url_domain |
| `codex.google.com` | url_domain |
| `notion.so` | url_domain |
| `figma.com` | url_domain |
| `linear.app` | url_domain |
| `vercel.com` | url_domain |
| `code.exe` | app_name |
| `cursor.exe` | app_name |
| `windowsterminal.exe` | app_name |
| `rider64.exe` | app_name |
| `datagrip64.exe` | app_name |

### 비생산적 (unproductive)

| 패턴 | 유형 |
|------|------|
| `youtube.com` | url_domain |
| `instagram.com` | url_domain |
| `twitter.com` | url_domain |
| `x.com` | url_domain |
| `reddit.com` | url_domain |
| `tiktok.com` | url_domain |
| `netflix.com` | url_domain |
| `steam.exe` | app_name |

---

## 알림 시스템

### 임계값 알림

| 트리거 | 기본값 | 알림 텍스트 예시 | 설정 가능 여부 |
|--------|--------|-----------------|--------------|
| 비생산적 연속 사용 | 30분 | "YouTube에서 30분 이상 사용 중입니다" | ✅ (5~120분) |
| 비생산적 일일 누적 | 2시간 | "오늘 비생산적 활동 2시간 초과" | ✅ (30분~8시간) |
| 알림 무시 쿨다운 | 30분 | *(같은 알림 30분 내 재발송 안 함)* | ✅ |

### 일일 요약

- **기본 시간**: 저녁 8:00 (설정 가능)
- **내용**: "오늘 생산적 N시간 M분 / 비생산적 X시간 Y분"
- **비활성화 가능**: 설정에서 끄기 가능

---

## 에러 처리

| 시나리오 | 처리 방식 |
|----------|---------|
| Firefox URL 읽기 실패 | URL null로 저장, 앱 이름만으로 분류 진행 |
| DB 잠금 오류 | WAL 모드 사용, 최대 3회 재시도 후 건너뜀 |
| categories.json 손상 | 기본값으로 폴백, 트레이에 경고 배지 표시 |
| UI Automation 접근 거부 | 해당 창 추적 건너뜀, 에러 로그 기록 |
| 앱 충돌 재시작 | electron-squirrel-startup으로 자동 재시작 |

---

## UI 명세

### 트레이 아이콘

- **툴팁**: "FocusTrack: 오늘 생산적 4h 20m / 비생산적 1h 05m"
- **우클릭 메뉴**: 대시보드 열기 / 추적 일시정지 / 종료
- **아이콘 배지**: 비생산적 시간이 임계값 초과 시 주황색 점

### 대시보드 창

**오늘 통계 섹션**
- 생산적 / 비생산적 / 중립 시간 카드
- 생산성 점수 = 생산적 / (생산적 + 비생산적) × 100

**시간별 흐름 차트**
- X축: 오늘 0~24시
- Y축: 활동 종류 (색상으로 구분)
- 라이브러리: Recharts

**상위 앱/사이트 목록**
- 오늘 사용 시간 기준 정렬
- 카테고리 배지 표시

**주간 트렌드 (탭)**
- 최근 7일 일별 생산적/비생산적 막대 차트

### 설정 페이지

- 세션 최소 지속 시간: 1~30초 (기본 5초)
- 알림 임계값 설정
- 일일 요약 시간 설정
- 데이터 보존 기간: 30일 / 90일 / 180일 / 1년 (기본 90일)
- 시작 시 자동 실행 토글

---

## 테스팅 전략

### Unit Tests (Vitest)

- `CategoryService.classify()` — 패턴 매칭 로직
- `TrackingEngine` — 세션 시작/종료 판단 로직
- `NotificationService` — 임계값 계산 로직

### Integration Tests

- `TrackingEngine` + `SQLiteStore` (실제 인메모리 SQLite 사용)
- DB 집계 쿼리 (오늘 통계, 주간 통계)

---

## 배포 계획

| 항목 | 내용 |
|------|------|
| **패키징** | electron-builder, NSIS 인스톨러 |
| **자동 업데이트** | electron-updater + GitHub Releases |
| **코드 서명** | 초기 생략, Product Hunt 전 Authenticode 적용 |
| **라이선스** | MIT |
| **배포 채널** | GitHub Releases → 추후 Product Hunt |

---

## Mac 이식 시 변경 사항

| 변경 대상 | Windows | Mac (추후) |
|----------|---------|-----------|
| URL 추적 | UI Automation API | Accessibility API + AppleScript |
| 창 이벤트 | SetWinEventHook | NSWorkspace.didActivateApplicationNotification |
| 알림 | Windows 토스트 | macOS UserNotifications |
| 트레이 | Electron Tray (Windows) | Electron Tray (macOS StatusItem) |
| 데이터 경로 | `%APPDATA%/focustrack` | `~/Library/Application Support/focustrack` |

**이식 예상 작업**: `MacTrackerService.ts` 구현 + electron-builder macOS 설정 추가.  
나머지 코드(UI, DB, 카테고리, 알림 로직)는 재사용 가능.

---

## 미결 사항 (Reviewer Concerns)

- Firefox URL 추적 신뢰성: UI Automation으로 Firefox에서 실제 얼마나 동작하는지 검증 필요
- Windows Defender / 안티바이러스 소프트웨어가 UI Automation을 차단하는 케이스 사전 테스트 필요
