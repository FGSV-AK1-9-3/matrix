(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const inSites = window.location.pathname
    .replace(/\\/g, '/')
    .includes('/sites/');
  const root = inSites ? '../' : '';
  const sites = inSites ? '' : 'sites/';

  const links = [
    {
      id: 'background.html',
      href: sites + 'background.html',
      label: 'Was ist SCENIC?',
    },
    {
      id: 'procedure_description.html',
      href: sites + 'procedure_description.html',
      label: 'Wie funktioniert es?',
    },
    {
      id: 'intro.html',
      href: sites + 'intro.html',
      label: 'Was ist eine Simulation?',
    },
  ];

  const normalItems = links
    .map(
      (l) =>
        `<li class="nav-item">
        <a class="nav-link${page === l.id ? ' active' : ''}" href="${l.href}">
          ${l.label}
        </a>
      </li>`,
    )
    .join('');

  const exampleActive = [
    'queue.html',
    'evacuation.html',
    'simulations-quiz.html',
  ].includes(page);

  const exampleDropdown = `
<li class="nav-item dropdown">
  <a
    class="nav-link dropdown-toggle${exampleActive ? ' active' : ''}"
    href="#"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Beispiele
  </a>

  <ul class="dropdown-menu">
    <li><a class="dropdown-item${page === 'queue.html' ? ' active' : ''}" href="${sites}queue.html">Warteschlange</a></li>
    <li><a class="dropdown-item${page === 'evacuation.html' ? ' active' : ''}" href="${sites}evacuation.html">Räumung</a></li>
    <li><a class="dropdown-item${page === 'simulations-quiz.html' ? ' active' : ''}" href="${sites}simulations-quiz.html">Quiz</a></li>
  </ul>
</li>
`;

  const faqItem = `
<li class="nav-item">
  <a class="nav-link${page === 'faq.html' ? ' active' : ''}" href="${sites}faq.html">
    FAQs
  </a>
</li>
`;

  const items = normalItems + exampleDropdown + faqItem;

  const nav = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
        <a class="navbar-brand" href="${root}index.html">
            SCENIC
        </a>

        <button
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            class="navbar-toggler"
            data-bs-target="#navbarNav"
            data-bs-toggle="collapse"
            type="button"
        >
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                ${items}
            </ul>
        </div>
    </div>
</nav>`;

  document.currentScript.insertAdjacentHTML('afterend', nav);
})();
