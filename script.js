// 1. 원본 템플릿 기능: 푸터 연도 자동 갱신
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// 2. 새 기능: 모바일 내비게이션 토글
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });
}

// 3. 새 기능: 포트폴리오 카드 필터
const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('[data-category]');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filterButtons.forEach(b => {
      const chosen = b === button;
      b.classList.toggle('selected', chosen);
      b.setAttribute('aria-pressed', String(chosen));
    });
    let visible = 0;
    projectCards.forEach(card => {
      const show = category === 'all' || card.dataset.category === category;
      card.hidden = !show;
      if (show) visible++;
    });
    const empty = document.getElementById('empty-state');
    if (empty) empty.hidden = visible !== 0;
  });
});

// 4. 새 기능: 연락처 폼은 전송하지 않고 메시지 복사만 수행합니다.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const name = document.getElementById('visitor-name').value.trim();
    const message = document.getElementById('visitor-message').value.trim();
    const feedback = document.getElementById('form-feedback');
    if (!name || !message) { feedback.textContent = '이름과 메시지를 입력해 주세요.'; return; }
    const content = `보낸 사람: ${name}\n메시지: ${message}`;
    try {
      await navigator.clipboard.writeText(content);
      feedback.textContent = '메시지를 복사했습니다. 원하는 곳에 붙여넣으세요.';
    } catch (error) {
      feedback.textContent = '브라우저에서 복사가 차단되었습니다. 텍스트를 직접 선택해 복사해 주세요.';
    }
  });
}
