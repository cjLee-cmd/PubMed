// 📄 파일명: js/script.js

const keywordContainer = document.getElementById('keyword-container');
const summary = document.getElementById('summary');

// 복사/붙여넣기 유틸리티 함수들
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('키워드가 클립보드에 복사되었습니다.');
  } catch (err) {
    console.error('복사 실패:', err);
    // fallback method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('키워드가 클립보드에 복사되었습니다.');
    } catch (fallbackErr) {
      showToast('복사에 실패했습니다.');
    }
    document.body.removeChild(textArea);
  }
}

async function pasteFromClipboard(inputElement) {
  try {
    const text = await navigator.clipboard.readText();
    inputElement.value = text;
    inputElement.dispatchEvent(new Event('input'));
    showToast('키워드가 붙여넣기되었습니다.');
  } catch (err) {
    console.error('붙여넣기 실패:', err);
    showToast('붙여넣기에 실패했습니다. Ctrl+V를 사용해보세요.');
  }
}

// 토스트 메시지 표시
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s;
  `;
  
  document.body.appendChild(toast);
  
  // 애니메이션
  setTimeout(() => toast.style.opacity = '1', 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 2000);
}

// 컨텍스트 메뉴 표시
function showContextMenu(event, inputElement) {
  // 기존 컨텍스트 메뉴 제거
  const existingMenu = document.querySelector('.context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.cssText = `
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
    min-width: 120px;
  `;

  const copyItem = document.createElement('div');
  copyItem.textContent = '📋 복사';
  copyItem.style.cssText = `
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  `;
  copyItem.onmouseover = () => copyItem.style.background = '#f0f0f0';
  copyItem.onmouseout = () => copyItem.style.background = 'white';
  copyItem.onclick = () => {
    copyToClipboard(inputElement.value);
    menu.remove();
  };

  const pasteItem = document.createElement('div');
  pasteItem.textContent = '📄 붙여넣기';
  pasteItem.style.cssText = `
    padding: 10px 15px;
    cursor: pointer;
  `;
  pasteItem.onmouseover = () => pasteItem.style.background = '#f0f0f0';
  pasteItem.onmouseout = () => pasteItem.style.background = 'white';
  pasteItem.onclick = () => {
    pasteFromClipboard(inputElement);
    menu.remove();
  };

  menu.appendChild(copyItem);
  menu.appendChild(pasteItem);
  
  // 메뉴 위치 설정
  menu.style.left = event.pageX + 'px';
  menu.style.top = event.pageY + 'px';
  
  document.body.appendChild(menu);

  // 다른 곳 클릭시 메뉴 닫기
  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    });
  }, 10);
}

function updateSummary() {
  const groups = document.querySelectorAll('.keyword-group');
  const parts = [];

  groups.forEach((group, index) => {
    const input = group.querySelector('input').value.trim();
    const activeBtn = group.querySelector('button.active');
    if (!input) return;
    const formatted = `"${input}"`;

    if (parts.length > 0) {
      const prevGroup = groups[index - 1];
      const prevBtn = prevGroup ? prevGroup.querySelector('button.active') : null;
      if (prevBtn) parts.push(prevBtn.textContent.toUpperCase());
    }
    parts.push(formatted);
  });

  let formattedText = '';
  for (let i = 0; i < parts.length; i++) {
    formattedText += parts[i];
    if (i < parts.length - 1) formattedText += ' ';
    if ((i + 1) % 5 === 0) formattedText += '\n';
  }

  summary.textContent = formattedText || '검색 조건이 없습니다.';
}

function createKeywordGroup() {
  const group = document.createElement('div');
  group.className = 'keyword-group';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter keyword...';

  const andBtn = document.createElement('button');
  andBtn.textContent = 'AND';
  const orBtn = document.createElement('button');
  orBtn.textContent = 'OR';
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';

  // 복사/붙여넣기 버튼 추가
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '📋';
  copyBtn.title = 'Copy keyword';
  copyBtn.onclick = () => copyToClipboard(input.value);

  const pasteBtn = document.createElement('button');
  pasteBtn.textContent = '📄';
  pasteBtn.title = 'Paste keyword';
  pasteBtn.onclick = () => pasteFromClipboard(input);

  [andBtn, orBtn].forEach(btn => {
    btn.onclick = () => {
      andBtn.classList.remove('active');
      orBtn.classList.remove('active');
      btn.classList.add('active');

      maybeAddNewGroup();
      updateSummary();
    };
  });

  deleteBtn.onclick = () => {
    group.remove();
    updateSummary();
  };

  input.oninput = () => {
    maybeAddNewGroup();
    updateSummary();
  };

  input.onpaste = () => {
    setTimeout(updateSummary, 100);
  };

  // 키보드 단축키 추가 (Ctrl+C, Ctrl+V)
  input.onkeydown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'c') {
        copyToClipboard(input.value);
      } else if (e.key === 'v') {
        // 기본 브라우저 붙여넣기 동작을 허용하고 업데이트만 트리거
        setTimeout(() => {
          maybeAddNewGroup();
          updateSummary();
        }, 10);
      }
    }
  };

  // 컨텍스트 메뉴 비활성화 및 커스텀 메뉴 추가
  input.oncontextmenu = (e) => {
    e.preventDefault();
    showContextMenu(e, input);
  };

  function maybeAddNewGroup() {
    if (input.value && (andBtn.classList.contains('active') || orBtn.classList.contains('active'))) {
      const lastGroup = keywordContainer.lastElementChild;
      if (lastGroup === group) {
        createKeywordGroup();
      }
    }
  }

  group.appendChild(input);
  group.appendChild(copyBtn);
  group.appendChild(pasteBtn);
  group.appendChild(andBtn);
  group.appendChild(orBtn);
  group.appendChild(deleteBtn);
  keywordContainer.appendChild(group);
}

function validateSearchQuery(query) {
  const invalid = /\b(AND|OR)\b\s*$/i;
  const doubleOperators = /\b(AND|OR)\b\s+\b(AND|OR)\b/i;
  if (invalid.test(query) || doubleOperators.test(query)) {
    alert('검색 조건식에 오류가 있습니다. AND/OR 연산자의 위치를 확인하세요.');
    return false;
  }
  return true;
}

async function search() {
  const rawQuery = summary.textContent.trim();
  if (!validateSearchQuery(rawQuery)) return;

  const apiKey = CONFIG.NCBI_API_KEY;
  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = `<p>🔍 검색 중입니다... "${rawQuery}"</p>`;

  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(rawQuery)}&retmode=json&retmax=10&api_key=${apiKey}`;

  try {
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    const ids = searchData.esearchresult?.idlist || [];
    if (ids.length === 0) {
      resultsEl.innerHTML = `<p>🔎 검색 결과가 없습니다.</p>`;
      currentSearchResults = []; // 검색 결과 초기화
      updateSaveButtons(false); // 저장 버튼 비활성화
      return;
    }

    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json&api_key=${apiKey}`;
    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=text&rettype=abstract&api_key=${apiKey}`;
    const fetchRes = await fetch(fetchUrl);
    const abstractText = await fetchRes.text();
    const abstractList = abstractText.split(/\n\n(?=PMID: )/g);

    const resultList = ids.map((id, index) => {
      const item = summaryData.result[id];
      return {
        pmid: id,
        title: item.title || '제목 없음',
        authors: (item.authors || []).map(a => a.name),
        source: item.source || '',
        pubdate: item.pubdate || '',
        abstract: abstractList[index] || '초록 없음'
      };
    });

    resultsEl.innerHTML = `<pre>${JSON.stringify(resultList, null, 2)}</pre>`;
    currentSearchResults = resultList; // 검색 결과 저장
    updateSaveButtons(true); // 저장 버튼 활성화
  } catch (error) {
    console.error(error);
    resultsEl.innerHTML = `<p style="color: red;">❌ 검색 중 오류가 발생했습니다.</p>`;
  }
}

createKeywordGroup();

// Summary 박스 복사/붙여넣기 기능 초기화
function initializeSummaryFeatures() {
  const summaryElement = document.getElementById('summary');
  const copySummaryBtn = document.querySelector('.copy-summary-btn');
  const pasteSummaryBtn = document.querySelector('.paste-summary-btn');

  // 복사 버튼 이벤트
  copySummaryBtn.onclick = () => {
    const summaryText = summaryElement.textContent || summaryElement.innerText;
    copyToClipboard(summaryText);
  };

  // 붙여넣기 버튼 이벤트
  pasteSummaryBtn.onclick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        // 붙여넣은 텍스트를 파싱하여 키워드 그룹들을 생성
        parseSummaryAndCreateGroups(text);
        showToast('검색 조건이 붙여넣기되었습니다.');
      }
    } catch (err) {
      console.error('붙여넣기 실패:', err);
      showToast('붙여넣기에 실패했습니다. 수동으로 입력해주세요.');
    }
  };

  // 컨텍스트 메뉴 추가
  summaryElement.oncontextmenu = (e) => {
    e.preventDefault();
    showSummaryContextMenu(e, summaryElement);
  };

  // 키보드 단축키 (summary 박스에 포커스가 있을 때)
  summaryElement.tabIndex = 0; // 포커스 가능하게 만들기
  summaryElement.onkeydown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'c') {
        const summaryText = summaryElement.textContent || summaryElement.innerText;
        copyToClipboard(summaryText);
      } else if (e.key === 'v') {
        pasteSummaryBtn.click();
      }
    }
  };
}

// Summary용 컨텍스트 메뉴
function showSummaryContextMenu(event, summaryElement) {
  // 기존 컨텍스트 메뉴 제거
  const existingMenu = document.querySelector('.context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.cssText = `
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
    min-width: 140px;
  `;

  const copyItem = document.createElement('div');
  copyItem.textContent = '📋 검색 조건 복사';
  copyItem.style.cssText = `
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  `;
  copyItem.onmouseover = () => copyItem.style.background = '#f0f0f0';
  copyItem.onmouseout = () => copyItem.style.background = 'white';
  copyItem.onclick = () => {
    const summaryText = summaryElement.textContent || summaryElement.innerText;
    copyToClipboard(summaryText);
    menu.remove();
  };

  const pasteItem = document.createElement('div');
  pasteItem.textContent = '📄 검색 조건 붙여넣기';
  pasteItem.style.cssText = `
    padding: 10px 15px;
    cursor: pointer;
  `;
  pasteItem.onmouseover = () => pasteItem.style.background = '#f0f0f0';
  pasteItem.onmouseout = () => pasteItem.style.background = 'white';
  pasteItem.onclick = () => {
    document.querySelector('.paste-summary-btn').click();
    menu.remove();
  };

  menu.appendChild(copyItem);
  menu.appendChild(pasteItem);
  
  // 메뉴 위치 설정
  menu.style.left = event.pageX + 'px';
  menu.style.top = event.pageY + 'px';
  
  document.body.appendChild(menu);

  // 다른 곳 클릭시 메뉴 닫기
  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    });
  }, 10);
}

// 붙여넣은 텍스트를 파싱하여 키워드 그룹 생성
function parseSummaryAndCreateGroups(text) {
  // 기존 키워드 그룹들 제거
  const keywordContainer = document.getElementById('keyword-container');
  keywordContainer.innerHTML = '';

  // 텍스트를 파싱하여 키워드와 연산자 추출
  const cleanText = text.replace(/\n/g, ' ').trim();
  const parts = cleanText.split(/\s+/);
  
  let currentKeyword = '';
  let currentOperator = '';
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    if (part.startsWith('"') && part.endsWith('"')) {
      // 따옴표로 둘러싸인 키워드
      currentKeyword = part.slice(1, -1);
      createKeywordGroupWithValue(currentKeyword, currentOperator);
      currentOperator = '';
    } else if (part.toUpperCase() === 'AND' || part.toUpperCase() === 'OR') {
      // 연산자
      currentOperator = part.toUpperCase();
    }
  }
  
  // 마지막에 빈 그룹 하나 추가
  createKeywordGroup();
  updateSummary();
}

// 값과 연산자가 설정된 키워드 그룹 생성
function createKeywordGroupWithValue(keyword, operator) {
  const group = document.createElement('div');
  group.className = 'keyword-group';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter keyword...';
  input.value = keyword;

  const andBtn = document.createElement('button');
  andBtn.textContent = 'AND';
  const orBtn = document.createElement('button');
  orBtn.textContent = 'OR';
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';

  // 복사/붙여넣기 버튼 추가
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '📋';
  copyBtn.title = 'Copy keyword';
  copyBtn.onclick = () => copyToClipboard(input.value);

  const pasteBtn = document.createElement('button');
  pasteBtn.textContent = '📄';
  pasteBtn.title = 'Paste keyword';
  pasteBtn.onclick = () => pasteFromClipboard(input);

  // 연산자 설정
  if (operator === 'AND') {
    andBtn.classList.add('active');
  } else if (operator === 'OR') {
    orBtn.classList.add('active');
  }

  [andBtn, orBtn].forEach(btn => {
    btn.onclick = () => {
      andBtn.classList.remove('active');
      orBtn.classList.remove('active');
      btn.classList.add('active');
      updateSummary();
    };
  });

  deleteBtn.onclick = () => {
    group.remove();
    updateSummary();
  };

  input.oninput = () => {
    updateSummary();
  };

  input.onpaste = () => {
    setTimeout(updateSummary, 100);
  };

  // 키보드 단축키 추가 (Ctrl+C, Ctrl+V)
  input.onkeydown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'c') {
        copyToClipboard(input.value);
      } else if (e.key === 'v') {
        setTimeout(() => {
          updateSummary();
        }, 10);
      }
    }
  };

  // 컨텍스트 메뉴 비활성화 및 커스텀 메뉴 추가
  input.oncontextmenu = (e) => {
    e.preventDefault();
    showContextMenu(e, input);
  };

  group.appendChild(input);
  group.appendChild(copyBtn);
  group.appendChild(pasteBtn);
  group.appendChild(andBtn);
  group.appendChild(orBtn);
  group.appendChild(deleteBtn);
  
  const keywordContainer = document.getElementById('keyword-container');
  keywordContainer.appendChild(group);
}

// Summary 기능 초기화
initializeSummaryFeatures();

// 저장 기능 관련 전역 변수
let currentSearchResults = [];

// 저장 기능 초기화
function initializeSaveFeatures() {
  const saveJsonBtn = document.querySelector('.save-json-btn');
  const saveExcelBtn = document.querySelector('.save-excel-btn');

  // JSON 저장 버튼 이벤트
  saveJsonBtn.onclick = () => {
    if (currentSearchResults.length > 0) {
      saveAsJson(currentSearchResults);
    }
  };

  // Excel 저장 버튼 이벤트
  saveExcelBtn.onclick = () => {
    if (currentSearchResults.length > 0) {
      saveAsExcel(currentSearchResults);
    }
  };
}

// JSON 형태로 저장
function saveAsJson(data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `pubmed_search_results_${getFormattedDate()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('JSON 파일이 다운로드되었습니다.');
  } catch (error) {
    console.error('JSON 저장 실패:', error);
    showToast('JSON 저장에 실패했습니다.');
  }
}

// Excel 형태로 저장
function saveAsExcel(data) {
  try {
    // 데이터를 Excel에 적합한 형태로 변환
    const excelData = data.map((item, index) => ({
      '번호': index + 1,
      'PMID': item.pmid,
      '제목': item.title,
      '저자': Array.isArray(item.authors) ? item.authors.join(', ') : item.authors || '',
      '출처': item.source,
      '발행일': item.pubdate,
      '초록': item.abstract
    }));

    // 워크북 생성
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PubMed 검색 결과');

    // 컬럼 너비 조정
    const colWidths = [
      { wch: 5 },  // 번호
      { wch: 10 }, // PMID
      { wch: 50 }, // 제목
      { wch: 30 }, // 저자
      { wch: 30 }, // 출처
      { wch: 12 }, // 발행일
      { wch: 80 }  // 초록
    ];
    ws['!cols'] = colWidths;

    // 파일 저장
    XLSX.writeFile(wb, `pubmed_search_results_${getFormattedDate()}.xlsx`);
    
    showToast('Excel 파일이 다운로드되었습니다.');
  } catch (error) {
    console.error('Excel 저장 실패:', error);
    showToast('Excel 저장에 실패했습니다.');
  }
}

// 날짜 포맷팅 함수 (파일명용)
function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}_${hour}${minute}`;
}

// 저장 버튼 활성화/비활성화
function updateSaveButtons(hasResults) {
  const saveJsonBtn = document.querySelector('.save-json-btn');
  const saveExcelBtn = document.querySelector('.save-excel-btn');
  
  if (saveJsonBtn && saveExcelBtn) {
    saveJsonBtn.disabled = !hasResults;
    saveExcelBtn.disabled = !hasResults;
  }
}

// 저장 기능 초기화
initializeSaveFeatures();