
/* =========================================================
   SIWAK BANTEN — MASTER COMPONENT
   HEADER + NAVBAR
========================================================= */

function renderHeader() {
  const headerContainer = document.getElementById('site-header');

  if (!headerContainer) return;

  headerContainer.innerHTML = `
    <header class="site-header" id="beranda">
      <div class="header-inner">

        <!-- BRAND -->
        <a href="index.html#beranda" class="brand">
          <div class="brand-logo">
            <img
              src="assets/logo-kemenag.png"
              alt="Logo Kementerian Agama Republik Indonesia"
            >
          </div>

          <div>
            <div class="brand-title">SIWAK BANTEN</div>
            <div class="brand-subtitle">
              Sistem Informasi Wakaf Banten
            </div>
          </div>
        </a>

        <!-- MOBILE MENU -->
        <button
          class="mobile-menu-toggle"
          id="mobileMenuToggle"
          type="button"
          aria-label="Buka menu"
          aria-expanded="false"
        >
          ☰
        </button>

        <!-- NAVIGATION -->
        <nav class="main-nav" id="mainNav">

          <!-- BERANDA -->
          <a href="index.html#beranda" class="nav-link">
            Beranda
          </a>

          <!-- DATA WAKAF -->
<a href="index.html#sebaran-data-wakaf" class="nav-link">
  Data Wakaf
</a>

          <!-- PETA WAKAF -->
          <a href="index.html#peta-wakaf" class="nav-link">
            Peta Wakaf
          </a>

          <!-- PEMANFAATAN -->
          <a href="index.html#pemanfaatan" class="nav-link">
            Pemanfaatan
          </a>

          <!-- STATISTIK -->
          <a href="index.html#statistik" class="nav-link">
            Statistik
          </a>

          <!-- MODE TERANG / GELAP -->
          <button
            class="theme-toggle"
            id="themeToggle"
            type="button"
            aria-label="Aktifkan mode gelap"
            title="Ganti tema"
          >
            <span class="theme-toggle-icon" aria-hidden="true">🌙</span>
            <span class="theme-toggle-label">Gelap</span>
          </button>

          <!-- LOGIN -->
          <a href="#" class="nav-link nav-login">
            Login
          </a>

        </nav>
      </div>
    </header>
  `;
}

/* =========================================================
   RENDER MASTER HEADER
========================================================= */

renderHeader();



/* =========================================================
   MODE TERANG / GELAP SIWAK BANTEN
========================================================= */

(function () {
  const tombolTema = document.getElementById('themeToggle');

  if (!tombolTema) return;

  const ikonTema = tombolTema.querySelector('.theme-toggle-icon');
  const labelTema = tombolTema.querySelector('.theme-toggle-label');
  const html = document.documentElement;

  function terapkanTema(tema) {
    html.setAttribute('data-theme', tema);

    const modeGelap = tema === 'dark';

    if (ikonTema) {
      ikonTema.textContent = modeGelap ? '☀️' : '🌙';
    }

    if (labelTema) {
      labelTema.textContent = modeGelap ? 'Terang' : 'Gelap';
    }

    tombolTema.setAttribute(
      'aria-label',
      modeGelap ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'
    );

    try {
      localStorage.setItem('siwak-theme', tema);
    } catch (error) {
      console.warn('Preferensi tema tidak dapat disimpan.');
    }
  }

  let temaAwal = 'light';

  try {
    const temaTersimpan = localStorage.getItem('siwak-theme');

    if (temaTersimpan === 'light' || temaTersimpan === 'dark') {
      temaAwal = temaTersimpan;
    }
  } catch (error) {
    console.warn('Preferensi tema tidak dapat dibaca.');
  }

  terapkanTema(temaAwal);

  tombolTema.addEventListener('click', function () {
    const temaSekarang = html.getAttribute('data-theme');
    const temaBerikutnya =
      temaSekarang === 'dark' ? 'light' : 'dark';

    terapkanTema(temaBerikutnya);
  });
})();


/* =========================================================
   MASTER FOOTER
========================================================= */

function renderFooter() {
  const footerContainer = document.getElementById('site-footer');

  if (!footerContainer) {
    return;
  }

  footerContainer.innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">

        <div class="footer-brand">
          <div class="footer-title">
            SIWAK BANTEN
          </div>

          <p>
            Sistem Informasi Wakaf Banten
          </p>
        </div>

        <div class="footer-info">
          <div class="footer-office">
            <strong>
              KANTOR WILAYAH KEMENTERIAN AGAMA PROVINSI BANTEN
            </strong>
          </div>

          <div>
            Jln. Syech Nawawi Al-Bantani Blok Instansi Vertikal No.01
          </div>

          <div>
            KP3B, Kec. Curug, Kota Serang - Banten
          </div>

          <div>
            Email: kanwilbanten@kemenag.go.id
          </div>

          <div class="footer-copyright">
            © 2026 SIWAK Banten
          </div>
        </div>

      </div>

      <div class="footer-developer">
        Developed by
        <a href="https://www.yudhicandra.my.id"
           target="_blank"
           rel="noopener noreferrer">@ydhcndr</a>
      </div>
    </footer>
  `;
}

/* =========================================================
   RENDER MASTER FOOTER
========================================================= */

renderFooter();


