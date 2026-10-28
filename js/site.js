(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#navigation');
  function closeMenu() {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });

  const buttons = [...document.querySelectorAll('[data-filter]')];
  const papers = [...document.querySelectorAll('.paper')];
  const count = document.querySelector('#publication-count');
  const allButton = document.querySelector('#all-papers');
  function filterPapers(filter) {
    let visible = 0;
    papers.forEach(paper => {
      const show = filter === 'all' || (filter === 'selected'
        ? paper.dataset.selected === 'true'
        : paper.dataset.tags.split(' ').includes(filter));
      paper.hidden = !show;
      if (show) visible++;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    count.textContent = `${visible} of ${papers.length} entries`;
    allButton.hidden = filter !== 'selected';
  }
  buttons.forEach(button => button.addEventListener('click', () => filterPapers(button.dataset.filter)));
  document.querySelectorAll('[data-show-topic]').forEach(link => link.addEventListener('click', () => {
    filterPapers(link.dataset.showTopic);
  }));
  allButton.addEventListener('click', () => {
    filterPapers('all');
    document.querySelector('[data-filter="all"]').focus({ preventScroll:true });
  });
  filterPapers('selected');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        menu.querySelectorAll('a[href^="#"]').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin:'-15% 0px -65% 0px', threshold:0 });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
})();
