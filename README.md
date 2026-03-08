# Tab Book

작업 중인 탭들을 단축키 하나로 저장하고 쉽게 불러올 수 있는 Chrome 확장 프로그램

## 주요 기능

### 탭 저장
- `Alt+S` : 현재 탭 저장
- `Alt+Shift+S` : 현재 창의 모든 탭 저장
- `Alt+N` : 팝업 열기
- 팝업 UI의 버튼을 통한 저장
- 중복 URL 자동 방지

### 카테고리 관리
- 카테고리 생성 / 이름 변경 / 삭제
- 드래그 앤 드롭으로 카테고리 순서 변경
- 활성 카테고리 드롭다운 선택 (단축키 저장 시 사용될 카테고리)
- 기본 카테고리: "기본"

### URL 관리
- 클릭으로 새 탭에서 열기
- 더블클릭으로 제목 인라인 편집
- 드래그 앤 드롭으로 URL 순서 변경 및 카테고리 간 이동
- 삭제 시 휴지통으로 이동 / 복원 가능
- "전체 열기" 버튼으로 카테고리 내 모든 URL 한번에 열기

### 사용자 인증
- Google OAuth 2.0 로그인
- Pro/Free 티어 구분 (현재 구독 기능은 stub 상태)

### 데이터 저장
- Chrome Sync Storage 사용 (기기 간 동기화)

## 기술 스택

- Vanilla JavaScript (ES6 Modules)
- Chrome Extensions API (Manifest V3)
- Chrome Storage Sync API
- 커스텀 상태관리 (useState 옵저버 패턴)

## 프로젝트 구조

```
tab_book/
├── popup.html              # 팝업 UI
├── popup.js                # 팝업 진입점
├── background.js           # 서비스 워커 (단축키 처리, 탭 열기)
├── loadData.js             # 데이터 초기화 및 구독 설정
├── css/
│   └── popup.css
├── icons/
│   └── icon16/32/48/128.png
└── src/
    ├── useState.js         # 커스텀 상태관리
    ├── env.js              # 환경변수 (API URL)
    ├── activeCategory/
    │   ├── renderActiveCategory.js   # 활성 카테고리 드롭다운
    │   └── saveButton.js             # 저장 버튼 이벤트
    ├── category/
    │   ├── renderCategory.js         # 카테고리 목록 렌더링
    │   ├── categoryCRUD.js           # 카테고리 CRUD
    │   ├── settingButton.js          # 카테고리 설정 메뉴 (이름변경/삭제)
    │   ├── openAllButton.js          # 전체 열기 버튼
    │   ├── deleteAllButton.js        # 전체 삭제 버튼
    │   ├── renderTrash.js            # 휴지통 카테고리 UI
    │   └── categoryDragAndDrop.js    # [미사용] 레거시 드래그앤드롭
    ├── saveurl/
    │   ├── renderUrls.js             # URL 목록 렌더링 및 인라인 편집
    │   └── urlsCRUD.js               # URL CRUD
    ├── common/
    │   ├── dragDropToCategoryAndUrls.js  # 드래그앤드롭 통합 핸들러
    │   ├── confirm.js                    # 커스텀 모달 (confirm/alert/prompt)
    │   ├── common.js                     # 공통 버튼 스타일 유틸
    │   └── afterEvent.js                 # URL 목록 토글 헬퍼
    ├── user/
    │   ├── loadUserData.js           # 사용자 데이터 로드
    │   ├── ProUserNoti.js            # 티어 제한 알림
    │   ├── payment.js                # [미사용] 결제 연동 stub
    │   └── toolTip.js                # 도움말 툴팁
    └── public/
        ├── p.png                     # 설정 아이콘
        └── warning.webp              # 경고 아이콘
```

## 알려진 이슈 / 리팩토링 대상

### 미사용 코드
- `src/category/categoryDragAndDrop.js` — `dragDropToCategoryAndUrls.js`로 대체되어 사용되지 않음
- `src/user/payment.js` — `redirectToPayment()`, `cancelPayment()` 함수가 어디서도 호출되지 않음
- `src/user/loadUserData.js` — `syncSubscriptionStatus()` 미호출, 항상 `userActive = true`로 설정

### 버그
- `ProUserNoti.js` — `newCategoryInput`, `addCategoryBtn` 전역 변수를 참조하지만 스코프에 존재하지 않음
- `confirm.js` — `getUsertoken()` 함수가 정의되지 않은 상태에서 호출됨
- `renderUrls.js` — 인라인 편집 시 `click` 이벤트 리스너가 해제되지 않아 메모리 누수 가능

### 코드 품질
- "기본", "휴지통" 등 매직 스트링이 여러 파일에 하드코딩
- 컴포넌트 라이프사이클 관리 부재
- DOM 조작 코드와 비즈니스 로직 혼재

## 빌드 및 실행

```bash
# secrets.json 생성 (CLIENT_ID, EXTENSION_KEY 포함)
# manifest.json 생성
node generate-manifest.js

# Chrome에서 로드
# chrome://extensions → 개발자 모드 → 압축해제된 확장 프로그램 로드
```

## 데이터 구조 (Chrome Storage)

```json
{
  "categories": ["기본", "카테고리명", ...],
  "savedUrls": {
    "기본": [
      { "title": "Google", "url": "https://google.com" }
    ],
    "휴지통": [
      { "title": "Old Site", "url": "...", "beforeCategory": "기본" }
    ]
  },
  "activeCategory": "기본",
  "userInfo": { "isActive": true, "expireDate": "..." }
}
```
