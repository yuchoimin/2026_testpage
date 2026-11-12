// 실습지의 첫 결과는 HTML을 읽는 중에 출력하고, 이후에는 DOM을 갱신합니다.
function writeInitialResult(result) {
  document.write('<strong id="practice-value" class="practice-value">' +
    escapeHtml(result.value) + '</strong><p id="practice-detail" class="practice-detail">' +
    escapeHtml(result.detail) + '</p>');
}

function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function showResult(result) {
  document.getElementById('practice-value').textContent = result.value;
  document.getElementById('practice-detail').textContent = result.detail;
}

function readDatePrompts(today) {
  const yearStr = prompt('목표 연도를 입력하세요 (예: 2026)', String(today.getFullYear()));
  if (!yearStr?.trim()) return null;

  const monthStr = prompt('목표 월을 입력하세요 (1~12)', String(today.getMonth() + 1));
  if (!monthStr?.trim()) return null;

  const dayStr = prompt('목표 일을 입력하세요 (1~31)', String(today.getDate()));
  if (!dayStr?.trim()) return null;

  return [yearStr.trim(), monthStr.trim(), dayStr.trim()];
}

function calculateDday(dateParts, today) {
  if (!dateParts) {
    return { value: '계산 취소', detail: '아래 입력란에서 목표 날짜를 선택해 다시 계산할 수 있어요.' };
  }

  const [yearStr, monthStr, dayStr] = dateParts;
  const invalid = { value: '날짜 확인', detail: '1000~9999년 사이의 실제 날짜를 입력해 주세요.' };
  if (!/^[1-9]\d{3}$/.test(yearStr) || !/^\d{1,2}$/.test(monthStr) || !/^\d{1,2}$/.test(dayStr)) {
    return invalid;
  }

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // 양쪽 날짜를 UTC 자정으로 맞춰 시각이나 서머타임의 영향을 없앱니다.
  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const currentDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  if (targetDate.getUTCFullYear() !== year || targetDate.getUTCMonth() !== month - 1 || targetDate.getUTCDate() !== day) {
    return invalid;
  }

  const diffMs = targetDate.getTime() - currentDate.getTime();
  const diffDay = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  let value = 'D-Day';
  if (diffDay > 0) {
    value = 'D-' + diffDay;
  } else if (diffDay < 0) {
    value = 'D+' + Math.abs(diffDay);
  }

  const dateText = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(targetDate);

  return { value, detail: '목표일 ' + dateText, inputDate: targetDate.toISOString().slice(0, 10) };
}

function mountDday(initialResult, today) {
  const form = document.getElementById('dday-form');
  const input = document.getElementById('target-date');
  const todayLabel = document.getElementById('dday-today');

  function updateToday(date) {
    todayLabel.textContent = '오늘 ' + date.toLocaleDateString('ko-KR', { dateStyle: 'long' });
  }

  updateToday(today);
  input.value = initialResult.inputDate || '';
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const now = new Date();
    updateToday(now);
    showResult(calculateDday(input.value.split('-'), now));
  });
}

function splitCandidates(text) {
  const items = [];
  for (const part of text.split(',')) {
    const item = part.trim();
    if (item) items.push(item);
  }
  return items;
}

function randomIndex(items) {
  return Math.floor(Math.random() * items.length);
}

function drawResult(choice) {
  return { value: choice, detail: '오늘의 선택' };
}

function mountRandom(items, selectedIndex) {
  const list = document.getElementById('candidate-list');
  const input = document.getElementById('candidate-input');
  const count = document.getElementById('candidate-count');
  const drawButton = document.getElementById('draw-button');
  const form = document.getElementById('candidate-form');

  function updateCount() {
    const length = list.childElementCount;
    count.textContent = '후보 ' + length + '개';
    drawButton.disabled = length === 0;
  }

  function clearSelection() {
    const selected = list.querySelector('.chosen');
    if (selected) selected.classList.remove('chosen');
  }

  function candidatesChanged() {
    clearSelection();
    updateCount();
    showResult({ value: '뽑기 대기', detail: list.childElementCount ? '후보 중 하나를 다시 뽑아보세요.' : '후보를 추가해 주세요.' });
  }

  function addCandidate(value, selected) {
    const item = document.createElement('li');
    const label = document.createElement('span');
    const remove = document.createElement('button');
    label.textContent = value;
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', value + ' 삭제');
    if (selected) item.classList.add('chosen');

    remove.addEventListener('click', function () {
      const next = item.nextElementSibling || item.previousElementSibling;
      list.removeChild(item);
      candidatesChanged();
      (next ? next.querySelector('button') : input).focus();
    });

    item.appendChild(label);
    item.appendChild(remove);
    list.appendChild(item);
  }

  items.forEach(function (item, index) {
    addCandidate(item, index === selectedIndex);
  });
  updateCount();

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const additions = splitCandidates(input.value);
    if (!additions.length) {
      input.setCustomValidity('추가할 후보를 하나 이상 입력해 주세요.');
      input.reportValidity();
      return;
    }

    additions.forEach(function (value) {
      addCandidate(value, false);
    });
    input.value = '';
    candidatesChanged();
    input.focus();
  });

  input.addEventListener('input', function () {
    input.setCustomValidity('');
  });

  drawButton.addEventListener('click', function () {
    clearSelection();
    const item = list.children[randomIndex(list.children)];
    item.classList.add('chosen');
    showResult(drawResult(item.firstElementChild.textContent));
  });
}
