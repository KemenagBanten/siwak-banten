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


let detailWakafMap = null;
let detailWakafMarker = null;

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

/* UPDATE SUMMARY CARDS */
const totalDataWakaf =
  document.getElementById('totalDataWakaf');

const totalWakif =
  document.getElementById('totalWakif');

const totalNazhir =
  document.getElementById('totalNazhir');

if (totalDataWakaf) {
  totalDataWakaf.textContent =
    result.data.total ?? 0;
}

if (totalWakif) {
  totalWakif.textContent =
    result.data.totalWakif ?? 0;
}

if (totalNazhir) {
  totalNazhir.textContent =
    result.data.totalNazhir ?? 0;
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
   DETAIL WAKAF - MODAL
   ========================================================= */

async function lihatDetailWakaf(idWakaf) {

  if (!idWakaf) {
    return;
  }

  const modal =
    document.getElementById(
      'detailWakafModal'
    );

  const loading =
    document.getElementById(
      'detailModalLoading'
    );

  const content =
    document.getElementById(
      'detailModalContent'
    );

  const errorBox =
    document.getElementById(
      'detailModalError'
    );

  if (!modal) {
    return;
  }

  /* BUKA MODAL */

  modal.classList.add('is-open');

  modal.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.style.overflow =
    'hidden';

  /* RESET */

  loading.style.display =
    'block';

  content.style.display =
    'none';

  errorBox.style.display =
    'none';


  try {

    const response =
      await fetch(
        SIWAK_API_URL +
        '?action=detailWakaf&idWakaf=' +
        encodeURIComponent(idWakaf)
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
      'DETAIL WAKAF API:',
      result
    );


    if (
      !result.success ||
      !result.data
    ) {

      throw new Error(
        result.message ||
        'Detail wakaf tidak tersedia.'
      );

    }


    renderDetailWakafModal(
      result.data
    );


    loading.style.display =
      'none';

    content.style.display =
      'block';


  } catch (error) {

    console.error(
      'ERROR DETAIL WAKAF:',
      error
    );

    loading.style.display =
      'none';

    errorBox.style.display =
      'block';

    document.getElementById(
      'detailModalErrorMessage'
    ).textContent =
      error.message ||
      'Terjadi kesalahan.';

  }

}


/* =========================================================
   RENDER DETAIL MODAL
   ========================================================= */

function renderDetailWakafModal(data) {

  const identitas =
    data.identitas || {};

  const peruntukan =
    data.peruntukan || {};

  const wakif =
    data.wakif || {};

  const nazhir =
    data.nazhir || {};

  const lokasi =
    data.lokasi || {};

  const dokumen =
    Array.isArray(data.dokumen)
      ? data.dokumen
      : [];


  /* IDENTITAS */

  document.getElementById(
    'detailModalTitle'
  ).textContent =
    identitas.kodeWakaf ||
    'Detail Wakaf';


  document.getElementById(
    'detailKodeWakaf'
  ).textContent =
    identitas.kodeWakaf ||
    '-';


  document.getElementById(
    'detailJenisAset'
  ).textContent =
    identitas.jenisAset ||
    '-';


  document.getElementById(
    'detailLuas'
  ).textContent =
    Number(
      identitas.luas || 0
    ).toLocaleString(
      'id-ID'
    ) +
    ' ' +
    (
      identitas.satuanLuas ||
      ''
    );


  document.getElementById(
    'detailTahunWakaf'
  ).textContent =
    identitas.tahunWakaf ||
    '-';


  document.getElementById(
    'detailNomorAiw'
  ).textContent =
    identitas.nomorAiwApaiw ||
    '-';


  document.getElementById(
    'detailNomorSertifikat'
  ).textContent =
    identitas.nomorSertifikat ||
    '-';


  document.getElementById(
    'detailStatusSertifikasi'
  ).textContent =
    formatStatusSertifikasi(
      identitas.statusSertifikasi
    );


  /* PERUNTUKAN */

  document.getElementById(
    'detailPeruntukan'
  ).textContent =
    peruntukan.nama ||
    '-';


  document.getElementById(
    'detailKategori'
  ).textContent =
    peruntukan.kategori ||
    '-';


  /* LOKASI */

  document.getElementById(
    'detailProvinsi'
  ).textContent =
    lokasi.provinsi ||
    '-';


  document.getElementById(
    'detailKabKota'
  ).textContent =
    lokasi.kabKota ||
    '-';


  document.getElementById(
    'detailKecamatan'
  ).textContent =
    lokasi.kecamatan ||
    '-';


  document.getElementById(
    'detailDesa'
  ).textContent =
    lokasi.desaKelurahan ||
    '-';


  document.getElementById(
    'detailAlamat'
  ).textContent =
    lokasi.alamat ||
    '-';

tampilkanPetaDetailWakaf(data.lokasi);
   
  /* WAKIF */

  document.getElementById(
    'detailWakif'
  ).textContent =
    wakif.nama ||
    '-';


  document.getElementById(
    'detailJenisWakif'
  ).textContent =
    wakif.jenis ||
    '-';


  /* NAZHIR */

  document.getElementById(
    'detailNazhir'
  ).textContent =
    nazhir.nama ||
    '-';


  document.getElementById(
    'detailJenisNazhir'
  ).textContent =
    nazhir.jenis ||
    '-';


  /* DOKUMEN */

  document.getElementById(
    'detailJumlahDokumen'
  ).textContent =
    dokumen.length +
    ' dokumen';


  const dokumenList =
    document.getElementById(
      'detailDokumenList'
    );


  if (!dokumen.length) {

    dokumenList.innerHTML = `
      <div class="detail-document-empty">
        Belum ada dokumen publik.
      </div>
    `;

  } else {

    dokumenList.innerHTML =
      dokumen.map(function (item) {

        return `
          <div class="detail-document-item">

            <strong>
              ${escapeHTML(
                item.jenisDokumen ||
                '-'
              )}
            </strong>

            <span>
              ${escapeHTML(
                item.namaFile ||
                '-'
              )}
            </span>

          </div>
        `;

      }).join('');

  }

}

function tampilkanPetaDetailWakaf(lokasi) {

  const mapElement =
    document.getElementById('detailWakafMap');

  if (!mapElement) {
    return;
  }

  const latitude =
    parseFloat(lokasi.latitude);

  const longitude =
    parseFloat(lokasi.longitude);

  // Hapus peta sebelumnya jika modal dibuka kembali
  if (detailWakafMap) {

    detailWakafMap.remove();

    detailWakafMap = null;
    detailWakafMarker = null;

  }

  // Jika koordinat tidak tersedia
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {

    mapElement.innerHTML = `
      <div class="detail-map-empty">
        <strong>Lokasi belum tersedia</strong>
        <span>Koordinat lokasi wakaf belum tercatat.</span>
      </div>
    `;

    return;
  }

  detailWakafMap =
    L.map('detailWakafMap');

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution:
        '&copy; OpenStreetMap contributors'
    }
  ).addTo(detailWakafMap);

  detailWakafMap.setView(
    [latitude, longitude],
    16
  );

  detailWakafMarker =
  L.marker([
    latitude,
    longitude
  ])
    .addTo(detailWakafMap)
    .bindPopup(
      '<strong>Lokasi Wakaf</strong>'
    )
    .openPopup();


// Pastikan Leaflet menghitung ulang ukuran
// setelah modal benar-benar tampil
setTimeout(function () {

  if (detailWakafMap) {

    detailWakafMap.invalidateSize(true);

    detailWakafMap.setView(
      [latitude, longitude],
      16
    );

  }

}, 300);

/* =========================================================
   TUTUP MODAL
   ========================================================= */

function tutupDetailWakaf() {

  const modal =
    document.getElementById(
      'detailWakafModal'
    );

  if (!modal) {
    return;
  }

  modal.classList.remove(
    'is-open'
  );

  modal.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.style.overflow =
    '';

}


/* =========================================================
   ESC UNTUK MENUTUP MODAL
   ========================================================= */

document.addEventListener(
  'keydown',
  function (event) {

    if (
      event.key === 'Escape'
    ) {

      tutupDetailWakaf();

    }

  }
);

/* =========================================================
   INITIALIZE DATA WAKAF
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
