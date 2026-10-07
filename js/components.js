/* =========================================================
   SIWAK BANTEN — MASTER COMPONENT
   HEADER + NAVBAR
========================================================= */

function renderHeader() {

  const headerContainer = document.getElementById('site-header');

  if (!headerContainer) return;

  headerContainer.innerHTML = `

    <header class="site-header">

      <div class="header-inner">

        <!-- BRAND -->
        <a href="index.html" class="brand">

          <div class="brand-logo">
            <img
              src="assets/logo-kemenag.png"
              alt="Logo Kementerian Agama Republik Indonesia"
            >
          </div>

          <div>
            <div class="brand-title">
              SIWAK BANTEN
            </div>

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
        >
          ☰
        </button>


        <!-- NAVIGATION -->
        <nav class="main-nav" id="mainNav">

          <a href="index.html" class="nav-link">
            Beranda
          </a>


          <!-- DATA WAKAF -->
          <div class="nav-dropdown">

            <button
              class="nav-link nav-dropdown-toggle"
              type="button"
            >
              Data Wakaf
              <span class="dropdown-arrow">⌄</span>
            </button>

            <div class="nav-dropdown-menu">

              <a href="#">
                Data Wakaf
              </a>

              <a href="#">
                Data Wakif
              </a>

              <a href="#">
                Data Nazhir
              </a>

            </div>

          </div>


          <!-- PETA WAKAF -->
          <a href="#" class="nav-link">
            Peta Wakaf
          </a>


          <!-- PEMANFAATAN -->
          <div class="nav-dropdown">

            <button
              class="nav-link nav-dropdown-toggle"
              type="button"
            >
              Pemanfaatan
              <span class="dropdown-arrow">⌄</span>
            </button>

            <div class="nav-dropdown-menu">

              <a href="#">
                Peruntukan Wakaf
              </a>

              <a href="#">
                Sebaran Pemanfaatan
              </a>

              <a href="#">
                Statistik Pemanfaatan
              </a>

            </div>

          </div>


          <!-- STATISTIK -->
          <a href="#" class="nav-link">
            Statistik
          </a>


          <!-- INFORMASI -->
          <div class="nav-dropdown">

            <button
              class="nav-link nav-dropdown-toggle"
              type="button"
            >
              Informasi
              <span class="dropdown-arrow">⌄</span>
            </button>

            <div class="nav-dropdown-menu">

              <a href="#">
                Tentang SIWAK
              </a>

              <a href="#">
                Regulasi Wakaf
              </a>

              <a href="#">
                Panduan
              </a>

              <a href="#">
                Berita / Informasi
              </a>

            </div>

          </div>


          <!-- LOGIN -->
          <a href="#" class="nav-link nav-login">
            Login Operator
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
   MASTER FOOTER
========================================================= */

function renderFooter() {

  const footerContainer =
    document.getElementById('site-footer');

  if (!footerContainer) {
    return;
  }

  footerContainer.innerHTML = `

    <footer class="site-footer">

      <div class="footer-inner">

        <div>

          <div class="footer-title">
            SIWAK BANTEN
          </div>

          <p>
            Sistem Informasi Wakaf Banten
          </p>

        </div>


        <div class="footer-info">

          <div>
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

    </footer>

  `;
}


/* =========================================================
   RENDER MASTER FOOTER
========================================================= */

renderFooter();
