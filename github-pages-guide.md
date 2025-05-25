# 🚀 GitHub Pages 배포 가이드

이 PubMed 검색 도구는 **GitHub Pages와 완벽하게 호환**됩니다! 

## 📋 배포 전 체크리스트

### ✅ 이미 완료된 GitHub Pages 호환성
- [x] **순수 클라이언트사이드**: 모든 기능이 브라우저에서 실행
- [x] **정적 파일만 사용**: HTML, CSS, JavaScript만 사용
- [x] **외부 API 사용**: NCBI E-utilities API를 직접 호출
- [x] **서버 의존성 없음**: 백엔드 서버나 데이터베이스 불필요
- [x] **CORS 호환**: PubMed API는 CORS를 지원함

## 🔧 배포 단계

### 1. GitHub 저장소 생성
```bash
# 새 저장소 생성 (GitHub 웹사이트에서)
# 저장소명: pubmed-search-tool (또는 원하는 이름)
```

### 2. 파일 업로드
다음 파일들을 저장소에 업로드:
```
pubmed-search-tool/
├── index.html          # 메인 HTML 파일
├── css/
│   └── style.css       # 스타일시트
├── js/
│   ├── script.js       # 메인 JavaScript
│   └── config.js       # API 키 설정
├── assets/
│   └── APTS_Logo.png   # 로고 이미지
├── explain.md          # 기능 설명서
└── github-pages-guide.md # 이 가이드
```

### 3. GitHub Pages 활성화
1. 저장소 설정 페이지로 이동 (`Settings` 탭)
2. 왼쪽 메뉴에서 `Pages` 클릭
3. **Source** 섹션에서:
   - `Deploy from a branch` 선택
   - **Branch**: `main` (또는 `master`) 선택
   - **Folder**: `/ (root)` 선택
4. `Save` 버튼 클릭

### 4. 배포 완료 확인
- 몇 분 후 `https://사용자명.github.io/저장소명` 에서 접근 가능
- 예: `https://johndoe.github.io/pubmed-search-tool`

## 🔑 API 키 설정

### config.js 파일 수정
```javascript
// js/config.js
const apiKey = 'YOUR_NCBI_API_KEY_HERE';
```

### API 키 발급 방법
1. [NCBI 계정 생성](https://www.ncbi.nlm.nih.gov/account/)
2. [API Key 설정 페이지](https://www.ncbi.nlm.nih.gov/account/settings/) 방문
3. "API Key Management" 섹션에서 새 키 생성
4. 생성된 키를 `config.js`에 입력

## 🔒 보안 고려사항

### API 키 보호
- **주의**: GitHub Pages는 정적 호스팅이므로 API 키가 클라이언트에 노출됩니다
- **권장사항**: 
  - NCBI API 키는 무료이며 공개되어도 큰 위험은 없음
  - 필요시 환경변수나 별도 설정 서비스 사용 고려

## 🌐 접근 URL

배포 완료 후 다음 URL로 접근:
```
https://사용자명.github.io/저장소명/
```

## 🔧 커스텀 도메인 (선택사항)

자신만의 도메인을 사용하려면:
1. 도메인 DNS 설정에서 CNAME 레코드 추가:
   ```
   CNAME: www → 사용자명.github.io
   ```
2. GitHub Pages 설정에서 Custom domain 입력
3. `Enforce HTTPS` 체크박스 활성화

## ✨ 주요 기능 (모든 기능이 GitHub Pages에서 동작)

- 🔍 **PubMed 검색**: 실시간 논문 검색
- 📝 **키워드 관리**: 동적 키워드 그룹 생성
- 📋 **복사/붙여넣기**: 키워드 및 검색조건 관리
- 📅 **날짜 필터**: 발행일 기준 필터링
- 💾 **결과 저장**: JSON/Excel 형식으로 다운로드
- 📱 **반응형 디자인**: 모바일/태블릿 지원

## 🛠️ 문제 해결

### 일반적인 문제들

1. **API 키 오류**
   - `config.js`에서 API 키 확인
   - 브라우저 개발자 도구에서 네트워크 탭 확인

2. **CORS 오류**
   - PubMed API는 CORS를 지원하므로 일반적으로 발생하지 않음
   - 브라우저 캐시 삭제 후 재시도

3. **파일 로딩 오류**
   - 모든 파일 경로가 올바른지 확인
   - 대소문자 구분 주의

## 📞 지원

문제가 발생하면:
1. 브라우저 개발자 도구의 Console 탭 확인
2. Network 탭에서 API 호출 상태 확인
3. GitHub Issues를 통해 문제 보고

---

🎉 **축하합니다!** 이제 GitHub Pages에서 PubMed 검색 도구를 무료로 호스팅할 수 있습니다!
