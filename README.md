# 공유 스터디 저장소

함께 공부하고, 각자의 정리를 비교하며, 다음 주제를 이어가는 스터디 공간입니다.

---

## 시작하기 (처음 참여하는 경우)

**1. 저장소 clone**
```bash
git clone [저장소 URL]
cd 공유스터디
```

**2. git email 확인**
```bash
git config user.email
```
출력된 email이 `CLAUDE.md`의 참여자 목록과 일치하는지 확인합니다.  
다르다면 수정하거나 관리자(river)에게 CLAUDE.md 업데이트를 요청하세요.

**3. Obsidian에서 열기**  
Obsidian → 저장소 폴더를 Vault로 추가하거나 기존 Vault 안에서 폴더로 접근합니다.

---

## 새 스터디 시작하기

**1. 폴더 생성**
```bash
mkdir -p "[큰 주제]/[작은 주제]/{river,kon,_공통}"
```

예시:
```bash
mkdir -p "AI프롬프트/컨텍스트엔지니어링/{river,kon,_공통}"
```

**2. 각자 정리 파일 작성**  
자신의 닉네임 폴더(`river/` 또는 `kon/`) 안에 자유롭게 파일을 작성합니다.  
파일명과 개수는 제한 없습니다.

**3. 커밋 및 push**
```bash
git add river/  # 또는 kon/
git commit -m "study: [작은 주제] river 정리 추가"
git push
```

---

## 모임에서 스킬 실행하기

[작은 주제] 폴더 안에서 Claude Code를 열고 순서대로 실행합니다.

```
1. /study-compare  — 두 파일 비교 + 토론
2. /study-next     — 다음 주제 결정
3. /study-log      — 스터디 로그 업데이트
```

---

## 폴더 구조 예시

```
[큰 주제]/
  [작은 주제]/
    river/
      정리1.md
      정리2.md
    kon/
      정리.md
    _공통/           ← 스킬이 자동 생성 (직접 편집 불필요)
      비교분석.md
      다음주제.md
스터디로그.md
CLAUDE.md
README.md
```

---

## 참여자

| 닉네임 | 역할 |
|--------|------|
| river | 저장소 관리자 |
| kon | 참여자 |
