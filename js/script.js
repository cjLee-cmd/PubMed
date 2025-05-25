// 📄 파일명: js/script.js

const keywordContainer = document.getElementById('keyword-container');
const summary = document.getElementById('summary');

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

  function maybeAddNewGroup() {
    if (input.value && (andBtn.classList.contains('active') || orBtn.classList.contains('active'))) {
      const lastGroup = keywordContainer.lastElementChild;
      if (lastGroup === group) {
        createKeywordGroup();
      }
    }
  }

  group.appendChild(input);
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
  } catch (error) {
    console.error(error);
    resultsEl.innerHTML = `<p style="color: red;">❌ 검색 중 오류가 발생했습니다.</p>`;
  }
}

createKeywordGroup();