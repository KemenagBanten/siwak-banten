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


/* =========================================================
   DATA WAKAF
   ========================================================= */

const SIWAK_API_URL =
  'https://script.google.com/macros/s/AKfycbxNziYiLidgouOhoOVOkZP_gdr2ifXqAYwzmgfoSAPaRfIxCAD2NsgtK0r2S-l0noda/exec';


/* =========================================================
   LOAD DATA WAKAF
   ========================================================= */

async function loadDataWakaf() {

  const tbody =
    document.getElementById('dataWakafBody');

  if (!tbody) {
    return;
  }


  try {

    tbody.innerHTML = `
      <tr>
        <td colspan="8">

          <div class="data-empty">

            <div class="data-empty-icon">
              ...
            </div>

            <strong>
              Memuat data wakaf...
            </strong>

            <p>
              Mohon tunggu sebentar.
            </p>

          </div>

        </td>
      </tr>
    `;


    const response =
      await fetch(
        SIWAK_API_URL +
        '?action=dataWakaf'
      );


    if (!response.ok) {

      throw new Error(
        'Server API mengembalikan status ' +
        response.status
      );

    }


    const result =
      await response.json();


    console.log(
      'DATA WAKAF API:',
      result
    );


    if (
      !result.success ||
      !result.data ||
      !Array.isArray(result.data.data)
    ) {

      throw new Error(
        result.message ||
        'Format data wakaf tidak sesuai.'
      );

    }


    renderDataWakaf(
      result.data.data
    );


  } catch (error) {

    console.error(
      'ERROR DATA WAKAF:',
      error
    );


    tbody.innerHTML = `
      <tr>
        <td colspan="8">

          <div class="data-empty">

            <div class="data-empty-icon">
              !
            </div>

            <strong>
              Data wakaf gagal dimuat
            </strong>

            <p>
              ${escapeHTML(
                error.message ||
                'Terjadi kesalahan saat mengambil data.'
              )}
            </p>

          </div>

        </td>
      </tr>
    `;

  }

}


/* =========================================================
   RENDER DATA WAKAF
   ========================================================= */

function renderDataWakaf(data) {

  const tbody =
    document.getElementById('dataWakafBody');

  if (!tbody) {
    return;
  }


  if (!data.length) {

    tbody.innerHTML = `
      <tr>
        <td colspan="8">

          <div class="data-empty">

            <div class="data-empty-icon">
              ⌂
            </div>

            <strong>
              Belum ada data wakaf publik
            </strong>

            <p>
              Data wakaf yang telah dipublikasikan
              akan ditampilkan di sini.
            </p>

          </div>

        </td>
      </tr>
    `;

    return;
  }


  tbody.innerHTML =
    data.map(function (item, index) {

      return `
        <tr>

          <td>
            ${index + 1}
          </td>

          <td>
            <strong>
              ${escapeHTML(item.kodeWakaf)}
            </strong>
          </td>

          <td>
            ${escapeHTML(item.jenisAset)}
          </td>

          <td>
            ${formatLuasWakaf(
              item.luas,
              item.satuanLuas
            )}
          </td>

          <td>
            ${escapeHTML(item.peruntukan)}
          </td>

          <td>
            ${escapeHTML(item.kabKota)}
          </td>

          <td>

            <span class="status-badge">
              ${escapeHTML(
                formatStatusSertifikasi(
                  item.statusSertifikasi
                )
              )}
            </span>

          </td>

          <td>

            <button
              type="button"
              class="data-action-button"
              onclick="lihatDetailWakaf('${escapeHTML(item.idWakaf)}')"
            >
              Detail
            </button>

          </td>

        </tr>
      `;

    }).join('');

}


/* =========================================================
   FORMAT LUAS
   ========================================================= */

function formatLuasWakaf(
  luas,
  satuan
) {

  const nilai =
    Number(luas || 0)
      .toLocaleString('id-ID');

  return (
    nilai +
    ' ' +
    (satuan || '')
  );

}


/* =========================================================
   FORMAT STATUS SERTIFIKASI
   ========================================================= */

function formatStatusSertifikasi(status) {

  const map = {

    BELUM_SERTIFIKAT:
      'Belum Bersertifikat',

    PROSES:
      'Dalam Proses',

    SUDAH_SERTIFIKAT:
      'Sudah Bersertifikat'

  };


  return (
    map[status] ||
    status ||
    '-'
  );

}


/* =========================================================
   DETAIL WAKAF
   ========================================================= */

function lihatDetailWakaf(idWakaf) {

  console.log(
    'Detail wakaf:',
    idWakaf
  );

  alert(
    'Detail untuk ' +
    idWakaf +
    ' akan dibuat pada tahap berikutnya.'
  );

}


/* =========================================================
   AUTO LOAD DATA WAKAF
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  function () {

    if (
      document.getElementById(
        'dataWakafBody'
      )
    ) {

      loadDataWakaf();

    }

  }
);
