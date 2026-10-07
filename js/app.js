/* =========================================================
   SIWAK BANTEN
   MASTER JAVASCRIPT
   ========================================================= */


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function initMobileMenu() {

  const toggle =
    document.getElementById('mobileMenuToggle');

  const nav =
    document.getElementById('mainNav');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', function () {

  nav.classList.toggle('is-open');

});

}


/* =========================================================
   CLOSE MOBILE MENU
   ========================================================= */

function closeMobileMenu() {

  const nav =
    document.getElementById('mainNav');

  if (!nav) {
    return;
  }

  nav.classList.remove('open');

}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function setActiveNav() {

  const currentPage =
    window.location.pathname
      .split('/')
      .pop() || 'index.html';

  const navLinks =
    document.querySelectorAll('.nav-link');

  navLinks.forEach(function (link) {

    const href =
      link.getAttribute('href');

    if (!href) {
      return;
    }

    const linkPage =
      href.split('/').pop();

    if (linkPage === currentPage) {

      link.classList.add('active');

    }

  });

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(value) {

  if (!value) {
    return '-';
  }

  const date =
    new Date(value);

  if (isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    'id-ID',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
  );

}


/* =========================================================
   SHOW STATUS
   ========================================================= */

function showStatus(
  elementId,
  message,
  type = 'info'
) {

  const element =
    document.getElementById(elementId);

  if (!element) {
    return;
  }

  element.className =
    'status-box status-' + type;

  element.textContent =
    message;

}


/* =========================================================
   SET BUTTON LOADING
   ========================================================= */

function setButtonLoading(
  button,
  loading,
  loadingText = 'Memproses...'
) {

  if (!button) {
    return;
  }

  if (loading) {

    if (!button.dataset.originalText) {

      button.dataset.originalText =
        button.textContent;

    }

    button.disabled = true;

    button.textContent =
      loadingText;

  } else {

    button.disabled = false;

    button.textContent =
      button.dataset.originalText ||
      button.textContent;

  }

}


/* =========================================================
   INITIALIZE MASTER
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  function () {

    initMobileMenu();

    setActiveNav();

  }
);
