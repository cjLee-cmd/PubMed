# 📋 PubMed 검색 도구 - 소프트웨어 기술 명세서

**프로젝트명**: PubMed Search Tool  
**버전**: 1.0.0  
**작성일**: 2025년 5월 25일  
**플랫폼**: GitHub Pages (정적 웹 호스팅)

---

## 🎯 프로젝트 개요

### 목적
의료진, 연구자, 학생들이 PubMed 데이터베이스에서 효율적으로 논문을 검색하고 관리할 수 있는 웹 기반 도구 개발

### 핵심 목표
- 직관적인 키워드 관리 시스템
- 실시간 PubMed API 검색
- 검색 결과 저장 및 관리
- GitHub Pages 정적 호스팅 지원

---

## 🏗️ 시스템 아키텍처

### 기술 스택
```
Frontend: HTML5, CSS3, JavaScript (ES6+)
API: NCBI E-utilities REST API
라이브러리: SheetJS (Excel 파일 생성)
호스팅: GitHub Pages (정적 웹사이트)
```

### 시스템 구조
```
Client-Side Application
├── UI Layer (HTML/CSS)
├── Business Logic (JavaScript)
├── API Communication Layer
└── Data Export Module
```

### 외부 의존성
- **NCBI E-utilities API**: PubMed 데이터 검색
- **SheetJS Library**: Excel 파일 생성
- **Browser APIs**: Clipboard, File Download

---

## 📁 파일 구조

```
PubMed/
├── index.html              # 메인 HTML 파일
├── css/
│   └── style.css          # 전체 스타일시트
├── js/
│   ├── script.js          # 메인 애플리케이션 로직
│   └── config.js          # API 키 설정
├── assets/
│   └── APTS_Logo.png      # 로고 이미지
├── explain.md             # 기능 설명서
├── github-pages-guide.md  # 배포 가이드
└── SW_Technical_Specification.md  # 기술 명세서 (이 파일)
```

---

## 🔧 핵심 기능 명세

### 1. 🔍 PubMed API 검색 시스템

#### 기술 구현
```javascript
// 3단계 API 호출 체인
1. esearch.fcgi  → 검색 ID 목록 획득
2. esummary.fcgi → 논문 메타데이터 획득  
3. efetch.fcgi   → 논문 초록 전문 획득
```

#### API 엔드포인트
- **Base URL**: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/`
- **Database**: `pubmed`
- **Format**: JSON/XML
- **Rate Limit**: API 키 사용 시 10 requests/second

#### 검색 결과 구조
```javascript
{
  pmid: "논문 ID",
  title: "논문 제목",
  authors: ["저자1", "저자2"],
  source: "저널명",
  pubdate: "발행일",
  abstract: "초록 전문"
}
```

### 2. 📝 동적 키워드 관리

#### 기능 명세
- **키워드 그룹**: 개별 검색어 입력 필드
- **논리 연산자**: AND/OR 토글 버튼
- **자동 그룹 생성**: 입력 시 새 그룹 추가
- **그룹 삭제**: 빈 그룹 자동 제거

#### 구현 방식
```javascript
// 동적 DOM 생성
function createKeywordGroup() {
  // 입력 필드 + AND/OR 버튼 조합
  // 이벤트 리스너 등록
  // 실시간 요약 업데이트
}
```

### 3. 📋 복사/붙여넣기 시스템

#### 지원 기능
- **개별 키워드**: 우클릭 컨텍스트 메뉴
- **전체 검색조건**: 요약 박스 복사/붙여넣기
- **지능형 파싱**: 붙여넣기 시 자동 키워드 분리

#### 브라우저 API 사용
```javascript
// 현대적 Clipboard API + fallback
await navigator.clipboard.writeText(text);
await navigator.clipboard.readText();
```

### 4. 📅 날짜 필터링

#### 필터 옵션
- **시작일**: YYYY-MM-DD 형식
- **종료일**: YYYY-MM-DD 형식
- **범위 검색**: 시작일~종료일
- **단방향 검색**: 이후/이전 검색

#### PubMed 쿼리 변환
```javascript
// 날짜 범위 → PubMed 검색 문법
"2020/01/01"[Date - Publication] : "2023/12/31"[Date - Publication]
```

### 5. 💾 결과 저장 시스템

#### 지원 형식
- **JSON**: 구조화된 데이터 저장
- **Excel**: SheetJS 라이브러리 사용

#### 파일명 규칙
```
pubmed_search_YYYYMMDD_HHMM.json
pubmed_search_YYYYMMDD_HHMM.xlsx
```

#### 데이터 구조
```javascript
{
  searchDate: "2025-05-25T10:30:00Z",
  searchQuery: "검색 쿼리",
  totalResults: 10,
  results: [/* 논문 데이터 배열 */]
}
```

---

## 🎨 UI/UX 설계

### 레이아웃 구조
```
┌─────────────────────────────────┐
│           Header (로고)          │
├─────────────────┬───────────────┤
│   검색 패널      │   결과 패널    │
│   - 키워드       │   - 논문 목록  │
│   - 날짜 필터    │   - 저장 버튼  │
│   - 검색 버튼    │               │
└─────────────────┴───────────────┘
```

### 반응형 디자인
- **데스크톱**: 2열 레이아웃 (flex: 1 | flex: 1.5)
- **태블릿**: 2열 유지, 최소 너비 적용
- **모바일**: 1열 수직 레이아웃

### 색상 팔레트
```css
주색상: #4b0082 (Purple)
배경색: #ffffff (White)
강조색: #e6e0ff (Light Purple)
테두리: #e9ecef (Light Gray)
텍스트: #000000 (Black)
```

---

## 🔒 보안 및 성능

### 보안 고려사항
- **API 키 노출**: 클라이언트사이드에서 불가피
- **CORS 정책**: PubMed API 공식 지원
- **XSS 방지**: 사용자 입력 검증
- **Rate Limiting**: API 요청 제한 준수

### 성능 최적화
- **비동기 처리**: async/await 패턴
- **에러 핸들링**: try-catch 블록
- **로딩 상태**: 사용자 피드백 제공
- **캐싱 없음**: 실시간 검색 우선

---

## 🌐 GitHub Pages 호환성

### 정적 웹사이트 요구사항 ✅
- [x] **서버사이드 코드 없음**: 순수 클라이언트사이드
- [x] **외부 API 사용**: NCBI REST API 직접 호출
- [x] **파일 다운로드**: Blob API 사용
- [x] **CORS 지원**: PubMed API 정책 준수

### 배포 프로세스
1. GitHub 저장소 생성
2. 파일 업로드 (index.html을 루트에 배치)
3. GitHub Pages 활성화 (Settings → Pages)
4. API 키 설정 (config.js 수정)

### 접근 URL 형식
```
https://사용자명.github.io/저장소명/
```

---

## 🧪 테스트 시나리오

### 기능 테스트
1. **키워드 검색**: "COVID-19" 단일 키워드
2. **복합 검색**: "COVID-19" AND "vaccine" 
3. **날짜 필터**: 2020-2023년 범위
4. **결과 저장**: JSON/Excel 다운로드
5. **복사/붙여넣기**: 키워드 관리

### 브라우저 호환성
- **Chrome**: 90+ (권장)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### 모바일 테스트
- **iOS Safari**: 반응형 레이아웃
- **Android Chrome**: 터치 인터페이스

---

## 🔄 버전 관리

### 현재 버전: 1.0.0
#### 포함 기능
- PubMed API 통합
- 키워드 관리 시스템
- 날짜 필터링
- 결과 저장 (JSON/Excel)
- 복사/붙여넣기 기능
- GitHub Pages 호환성

### 향후 개발 계획
#### v1.1.0 (예정)
- [ ] 검색 히스토리 저장
- [ ] 북마크 기능
- [ ] 고급 필터 옵션

#### v1.2.0 (예정)
- [ ] 논문 인용 형식 지원
- [ ] 다중 데이터베이스 지원
- [ ] 사용자 설정 저장

---

## 🛠️ 개발 환경

### 필수 요구사항
- **웹 브라우저**: 개발자 도구 지원
- **텍스트 에디터**: VS Code 권장
- **Git**: 버전 관리

### 선택 요구사항
- **Live Server**: 로컬 테스트용
- **GitHub Desktop**: GUI Git 클라이언트

---

## 📚 API 문서

### NCBI E-utilities
- **공식 문서**: https://www.ncbi.nlm.nih.gov/books/NBK25501/
- **API 키 발급**: https://www.ncbi.nlm.nih.gov/account/settings/
- **사용 제한**: 3 requests/second (키 없음), 10 requests/second (키 있음)

### SheetJS
- **공식 사이트**: https://sheetjs.com/
- **CDN**: https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js

---

## 🐛 알려진 이슈

### 현재 제한사항
1. **검색 결과 제한**: 최대 10개 논문 (API 제한)
2. **API 키 노출**: 클라이언트사이드 특성상 불가피
3. **인터넷 연결 필수**: 오프라인 사용 불가

### 해결 방안
1. **페이지네이션**: 다음 버전에서 구현 예정
2. **프록시 서버**: 필요시 별도 백엔드 구축
3. **캐싱**: LocalStorage 활용 고려

---

## 📞 지원 및 문의

### 문제 해결
1. **브라우저 개발자 도구**: Console/Network 탭 확인
2. **GitHub Issues**: 버그 리포트 및 기능 요청
3. **API 상태**: NCBI 서비스 상태 확인

### 연락처
- **개발자**: GitHub Issues
- **문서 업데이트**: Pull Request

---

## 📄 라이선스

이 프로젝트는 오픈소스이며, 교육 및 연구 목적으로 자유롭게 사용할 수 있습니다.

**마지막 업데이트**: 2025년 5월 25일  
**문서 버전**: 1.0
