(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const inSites = window.location.pathname
    .replace(/\\/g, '/')
    .includes('/sites/');
  const root = inSites ? '../' : '';
  const sites = inSites ? '' : 'sites/';

  const links = [
    { id: 'index.html', href: root + 'index.html', label: 'Matrix' },
    { id: 'intro.html', href: sites + 'intro.html', label: 'Einführung' },
    {
      id: 'background.html',
      href: sites + 'background.html',
      label: 'Hintergrund',
    },
    {
      id: 'procedure_description.html',
      href: sites + 'procedure_description.html',
      label: 'Verfahren',
    },
  ];

  const items = links
    .map(
      (l) =>
        `<li class="nav-item"><a class="nav-link${page === l.id ? ' active' : ''}" href="${l.href}">${l.label}</a></li>`,
    )
    .join('');

  const nav = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
        <a class="navbar-brand" href="${root}index.html">SCENIC</a>
        <button aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
            class="navbar-toggler" data-bs-target="#navbarNav" data-bs-toggle="collapse" type="button">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">${items}</ul>
        </div>
    </div>
</nav>`;

  document.currentScript.insertAdjacentHTML('afterend', nav);
})();
