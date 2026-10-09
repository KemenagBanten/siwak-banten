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

let semuaDataWakaf = [];
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
    semuaDataWakaf =
  result.data.data || [];

isiFilterKabKota(
  semuaDataWakaf
);

renderDataWakaf(
  semuaDataWakaf
);
     
renderPagination(
  semuaDataWakaf.length
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

let currentPage = 1;
const rowsPerPage = 10;
let dataWakafTampil = [];


// =======================================================
// LOAD DATA WAKIF
// =======================================================

function loadDataWakif() {

  const tbody =
    document.getElementById('dataWakifBody');

  if (!tbody) {
    return;
  }


  tbody.innerHTML = `
    <tr>
      <td colspan="9">
        <div class="data-empty">
          <div class="data-empty-icon">
            ...
          </div>

          <strong>
            Memuat data wakif...
          </strong>

          <p>
            Mohon tunggu sebentar.
          </p>
        </div>
      </td>
    </tr>
  `;


  fetch(
    SIWAK_API_URL + '?action=dataWakif'
  )

    .then(response => {

      if (!response.ok) {
        throw new Error(
          'Gagal menghubungi API.'
        );
      }

      return response.json();

    })

    .then(result => {

      if (
        !result.success ||
        !result.data
      ) {
        throw new Error(
          'Data wakif tidak dapat dimuat.'
        );
      }


      const data =
        result.data.data || [];
       
      
      // SIMPAN DATA WAKIF
      window.semuaDataWakif = data;
isiFilterKabKotaWakif(data);

      // TOTAL WAKIF
      const totalElement =
        document.getElementById(
          'totalDataWakif'
        );

      if (totalElement) {
        totalElement.textContent =
          data.length;
      }


      // TOTAL WAKIF YANG MEMILIKI WAKAF
      const totalAktifElement =
        document.getElementById(
          'totalWakifAktif'
        );

      if (totalAktifElement) {

        const totalAktif =
          data.filter(
            item =>
              Number(item.jumlahWakaf || 0) > 0
          ).length;

        totalAktifElement.textContent =
          totalAktif;
      }


      // TOTAL SELURUH WAKAF DARI WAKIF
      const totalWakafElement =
        document.getElementById(
          'totalWakafDariWakif'
        );

      if (totalWakafElement) {

        const totalWakaf =
          data.reduce(
            (total, item) =>
              total +
              Number(item.jumlahWakaf || 0),
            0
          );

        totalWakafElement.textContent =
          totalWakaf;
      }


      // TAMPILKAN DATA
      renderDataWakif(data);

    })

    .catch(error => {

      console.error(
        'ERROR DATA WAKIF:',
        error
      );


      tbody.innerHTML = `
        <tr>
          <td colspan="9">

            <div class="data-empty">

              <div class="data-empty-icon">
                !
              </div>

              <strong>
                Data wakif tidak dapat dimuat
              </strong>

              <p>
                ${error.message}
              </p>

            </div>

          </td>
        </tr>
      `;

    });

}


let semuaDataNazhir = [];
let hasilFilterNazhir = [];
let halamanNazhir = 1;
const dataPerHalamanNazhir = 10;

async function loadDataNazhir() {
  const tbody = document.getElementById('dataNazhirBody');

  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="9">
        <div class="data-empty">
          <strong>Memuat data Nazhir...</strong>
        </div>
      </td>
    </tr>
  `;

  try {
    const response = await fetch(
      SIWAK_API_URL + '?action=dataNazhir'
    );

    const result = await response.json();

    console.log('DATA NAZHIR API:', result);

    if (
      !result.success ||
      !result.data ||
      !Array.isArray(result.data.data)
    ) {
      throw new Error('Format data Nazhir tidak sesuai.');
    }

   
semuaDataNazhir = result.data.data;
hasilFilterNazhir = semuaDataNazhir;
halamanNazhir = 1;

     inisialisasiFilterNazhir();
     
const dataNazhir = semuaDataNazhir;

    const totalElement = document.getElementById('totalDataNazhir');

    if (totalElement) {
      totalElement.textContent = dataNazhir.length;
    }

    const totalAktif = document.getElementById('totalNazhirAktif');

    if (totalAktif) {
      totalAktif.textContent = dataNazhir.filter(function(nazhir) {
        return String(nazhir.statusNazhir || '').trim().toUpperCase() === 'AKTIF';
      }).length;
    }

    const resultInfo = document.getElementById('resultInfoNazhir');

    if (resultInfo) {
      resultInfo.textContent = 'Menampilkan ' + dataNazhir.length + ' data';
    }

    if (dataNazhir.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="data-empty">
              <strong>Data Nazhir belum tersedia</strong>
              <p>Belum ada data Nazhir yang dapat ditampilkan.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

   renderDataNazhir();

  } catch (error) {
    console.error('ERROR DATA NAZHIR:', error);

    tbody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="data-empty">
            <strong>Gagal memuat data Nazhir</strong>
            <p>Periksa koneksi API dan Console browser.</p>
          </div>
        </td>
      </tr>
    `;
  }
}


function terapkanFilterNazhir() {
  const filterKabKota = document.getElementById('filterKabKotaNazhir');
  const filterJenis = document.getElementById('filterJenisNazhir');
  const filterStatus = document.getElementById('filterStatusNazhir');
  const searchInput = document.getElementById('searchNazhir');

  const kabKotaDipilih = filterKabKota ? filterKabKota.value : '';
  const jenisDipilih = filterJenis ? filterJenis.value : '';
  const statusDipilih = filterStatus ? filterStatus.value : '';
  const kataKunci = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const hasilFilter = semuaDataNazhir.filter(function(nazhir) {
    const cocokKabKota =
      !kabKotaDipilih || nazhir.kabKota === kabKotaDipilih;

    const cocokJenis =
      !jenisDipilih || nazhir.jenisNazhir === jenisDipilih;

    const cocokStatus =
      !statusDipilih || nazhir.statusNazhir === statusDipilih;

    const teksPencarian = [
      nazhir.idNazhir,
      nazhir.namaNazhir,
      nazhir.jenisNazhir,
      nazhir.nomorRegistrasi,
      nazhir.kabKota,
      nazhir.kecamatan,
      nazhir.desaKelurahan,
      nazhir.statusNazhir
    ].join(' ').toLowerCase();

    const cocokPencarian =
      !kataKunci || teksPencarian.includes(kataKunci);

    return (
      cocokKabKota &&
      cocokJenis &&
      cocokStatus &&
      cocokPencarian
    );
  });

  hasilFilterNazhir = hasilFilter;
halamanNazhir = 1;
renderDataNazhir();
}


function renderDataNazhir() {
  const tbody = document.getElementById('dataNazhirBody');
  const resultInfo = document.getElementById('resultInfoNazhir');
  const pagination = document.getElementById('paginationNazhir');

  if (!tbody) return;

  const total = hasilFilterNazhir.length;
  const totalHalaman = Math.ceil(total / dataPerHalamanNazhir);

  if (halamanNazhir > totalHalaman && totalHalaman > 0) {
    halamanNazhir = totalHalaman;
  }

  const mulai = (halamanNazhir - 1) * dataPerHalamanNazhir;
  const dataHalaman = hasilFilterNazhir.slice(
    mulai,
    mulai + dataPerHalamanNazhir
  );

  if (resultInfo) {
    resultInfo.textContent = total === 0
      ? 'Tidak ada data'
      : `Menampilkan ${mulai + 1}–${Math.min(mulai + dataPerHalamanNazhir, total)} dari ${total} data`;
  }

  if (total === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="data-empty">
            <strong>Data Nazhir tidak ditemukan</strong>
            <p>Coba ubah kata pencarian atau pilihan filter.</p>
          </div>
        </td>
      </tr>
    `;

    if (pagination) pagination.innerHTML = '';
    return;
  }

  tbody.innerHTML = dataHalaman.map(function(nazhir, index) {
    const idNazhir = String(nazhir.idNazhir || '');

    return `
      <tr>
        <td>${mulai + index + 1}</td>
        <td>${escapeHTML(idNazhir || '-')}</td>
        <td>${escapeHTML(nazhir.namaNazhir || '-')}</td>
        <td>${escapeHTML(nazhir.jenisNazhir || '-')}</td>
        <td>${escapeHTML(nazhir.kabKota || '-')}</td>
        <td>${escapeHTML(nazhir.kecamatan || '-')}</td>
        <td>${escapeHTML(nazhir.desaKelurahan || '-')}</td>
        <td>${escapeHTML(nazhir.statusNazhir || '-')}</td>
        <td>
          <button
  type="button"
  class="btn-detail"
  onclick="lihatDetailNazhir('${idNazhir.replace(/'/g, "\\'")}')"
>
  Detail
</button>
        </td>
      </tr>
    `;
  }).join('');

  if (!pagination || totalHalaman <= 1) {
    if (pagination) pagination.innerHTML = '';
    return;
  }

  let tombol = `
    <button
      type="button"
      class="pagination-btn"
      ${halamanNazhir === 1 ? 'disabled' : ''}
      onclick="ubahHalamanNazhir(${halamanNazhir - 1})"
    >‹</button>
  `;

  for (let i = 1; i <= totalHalaman; i++) {
    tombol += `
      <button
        type="button"
        class="pagination-btn ${i === halamanNazhir ? 'active' : ''}"
        onclick="ubahHalamanNazhir(${i})"
      >${i}</button>
    `;
  }

  tombol += `
    <button
      type="button"
      class="pagination-btn"
      ${halamanNazhir === totalHalaman ? 'disabled' : ''}
      onclick="ubahHalamanNazhir(${halamanNazhir + 1})"
    >›</button>
  `;

  pagination.innerHTML = tombol;
}

function ubahHalamanNazhir(halaman) {
  const totalHalaman = Math.ceil(
    hasilFilterNazhir.length / dataPerHalamanNazhir
  );

  if (halaman < 1 || halaman > totalHalaman) return;

  halamanNazhir = halaman;
  renderDataNazhir();
}


async function lihatDetailNazhir(idNazhir) {
   

   console.log('Fungsi Detail Nazhir berjalan:', idNazhir);
   
  const modal = document.getElementById('detailNazhirModal');

   console.log('Modal ditemukan:', !!modal);
console.log('Class modal:', modal ? modal.className : 'TIDAK DITEMUKAN');
console.log('CSS display:', modal ? getComputedStyle(modal).display : '-');
console.log('CSS visibility:', modal ? getComputedStyle(modal).visibility : '-');
   
  const loading = document.getElementById('detailNazhirModalLoading');
  const error = document.getElementById('detailNazhirModalError');
  const errorMessage = document.getElementById('detailNazhirModalErrorMessage');
  const content = document.getElementById('detailNazhirModalContent');

  if (!modal) return;

  // Tampilkan modal dan status loading
  modal.classList.add('is-open');
modal.setAttribute('aria-hidden', 'false');
document.body.style.overflow = 'hidden';

  loading.style.display = 'block';
  error.style.display = 'none';
  content.style.display = 'none';

  try {
    const url = SIWAK_API_URL
      + '?action=detailNazhir&idNazhir='
      + encodeURIComponent(idNazhir);

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok || !result.success || !result.data) {
      throw new Error(
        result.message || 'Data Nazhir tidak ditemukan.'
      );
    }

    const data = result.data;

    // Isi data ke dalam modal
    document.getElementById('detailNazhirId').textContent =
      data.idNazhir || '-';

    document.getElementById('detailNazhirNama').textContent =
      data.namaNazhir || '-';

    document.getElementById('detailNazhirJenis').textContent =
      data.jenisNazhir || '-';

    document.getElementById('detailNazhirRegistrasi').textContent =
      data.nomorRegistrasi || '-';

    document.getElementById('detailNazhirStatus').textContent =
      data.statusNazhir || '-';

    document.getElementById('detailNazhirKabKota').textContent =
      data.kabKota || '-';

    document.getElementById('detailNazhirKecamatan').textContent =
      data.kecamatan || '-';

    document.getElementById('detailNazhirDesa').textContent =
      data.desaKelurahan || '-';

    document.getElementById('detailNazhirAlamat').textContent =
      data.alamat || '-';

    document.getElementById('detailNazhirKontak').textContent =
      data.kontak || '-';

    document.getElementById('detailNazhirEmail').textContent =
      data.email || '-';

    document.getElementById('detailNazhirKeterangan').textContent =
      data.keterangan || '-';

    document.getElementById('detailNazhirTanggalInput').textContent =
      formatTanggalNazhir(data.tanggalInput);

    document.getElementById('detailNazhirTanggalUpdate').textContent =
      formatTanggalNazhir(data.tanggalUpdate);

    document.getElementById('detailNazhirOperator').textContent =
      data.idOperator || '-';

    loading.style.display = 'none';
    content.style.display = 'block';

  } catch (err) {
    loading.style.display = 'none';
    error.style.display = 'block';
    errorMessage.textContent =
      err.message || 'Terjadi kesalahan saat memuat data.';
  }
}

function tutupDetailNazhir() {
  const modal = document.getElementById('detailNazhirModal');

  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function formatTanggalNazhir(nilai) {
  if (!nilai) return '-';

  const tanggal = new Date(nilai);

  if (isNaN(tanggal.getTime())) {
    return String(nilai);
  }

  return tanggal.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  });
}

function inisialisasiFilterNazhir() {
  const filterKabKota = document.getElementById('filterKabKotaNazhir');
  const filterJenis = document.getElementById('filterJenisNazhir');
  const filterStatus = document.getElementById('filterStatusNazhir');
  const searchInput = document.getElementById('searchNazhir');

  // Isi pilihan Kabupaten/Kota dari data API
  if (filterKabKota) {
    const pilihanLama = filterKabKota.value;
    const daftarKabKota = [
      ...new Set(
        semuaDataNazhir
          .map(function(nazhir) {
            return String(nazhir.kabKota || '').trim();
          })
          .filter(Boolean)
      )
    ].sort();

    filterKabKota.innerHTML =
      '<option value="">Semua Kabupaten / Kota</option>';

    daftarKabKota.forEach(function(nama) {
      const option = document.createElement('option');
      option.value = nama;
      option.textContent = nama;
      filterKabKota.appendChild(option);
    });

    filterKabKota.value = pilihanLama;
  }

  // Hubungkan perubahan filter
  if (filterKabKota) {
    filterKabKota.onchange = terapkanFilterNazhir;
  }

  if (filterJenis) {
    filterJenis.onchange = terapkanFilterNazhir;
  }

  if (filterStatus) {
    filterStatus.onchange = terapkanFilterNazhir;
  }

  if (searchInput) {
    searchInput.oninput = terapkanFilterNazhir;
  }
}

/* =========================================================
   PAGINATION DATA WAKIF
   ========================================================= */

let currentPageWakif = 1;
const rowsPerPageWakif = 10;
let dataWakifTampil = [];

/* =========================================================
   RENDER DATA WAKIF
   ========================================================= */

function renderDataWakif(data) {

  const tbody =
    document.getElementById('dataWakifBody');

  if (!tbody) return;


  // SIMPAN DATA HASIL FILTER
  dataWakifTampil = data || [];


  // HITUNG TOTAL HALAMAN
  const totalData =
    dataWakifTampil.length;

  const totalPages =
    Math.ceil(
      totalData / rowsPerPageWakif
    );


  // Jika halaman sekarang melebihi jumlah halaman
  if (
    totalPages > 0 &&
    currentPageWakif > totalPages
  ) {
    currentPageWakif = totalPages;
  }


  // Jika tidak ada data
  if (totalData === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center;">
          Belum ada data wakif.
        </td>
      </tr>
    `;

    renderPaginationWakif(0);

    return;
  }


  // HITUNG DATA UNTUK HALAMAN AKTIF
  const start =
    (currentPageWakif - 1) *
    rowsPerPageWakif;

  const end =
    start + rowsPerPageWakif;

  const dataHalaman =
    dataWakifTampil.slice(
      start,
      end
    );


  // KOSONGKAN TABEL
  tbody.innerHTML = '';


  // TAMPILKAN DATA
  dataHalaman.forEach(
    function (wakif, index) {

      const nomor =
        start + index + 1;


      const tr =
        document.createElement('tr');


      tr.innerHTML = `
        <td>${nomor}</td>

        <td>${wakif.idWakif || '-'}</td>

        <td>${wakif.namaWakif || '-'}</td>

        <td>${wakif.jenisWakif || '-'}</td>

        <td>${wakif.kabKota || '-'}</td>

        <td>${wakif.kecamatan || '-'}</td>

        <td>${wakif.desaKelurahan || '-'}</td>

        <td>${wakif.jumlahWakaf ?? 0}</td>

        <td>
          <button
            type="button"
            class="btn-detail-wakif"
            onclick="detailWakif('${wakif.idWakif}')">
            Detail
          </button>
        </td>
      `;


      tbody.appendChild(tr);

    }
  );


  // TAMPILKAN PAGINATION
  renderPaginationWakif(
    totalData
  );

}

/* =========================================================
   DETAIL DATA WAKIF
   ========================================================= */

function detailWakif(idWakif) {

  // -------------------------------------------------------
  // AMBIL MODAL
  // -------------------------------------------------------

  const modal =
    document.getElementById(
      'detailWakifModal'
    );


  if (!modal) {

    console.error(
      'Modal detail wakif tidak ditemukan.'
    );

    return;

  }


  // -------------------------------------------------------
  // TAMPILKAN MODAL
  // -------------------------------------------------------

  modal.classList.add('show');

  modal.setAttribute(
    'aria-hidden',
    'false'
  );


  // -------------------------------------------------------
  // TAMPILKAN LOADING
  // -------------------------------------------------------

  const loading =
    document.getElementById(
      'detailWakifModalLoading'
    );

  const errorBox =
    document.getElementById(
      'detailWakifModalError'
    );

  const content =
    document.getElementById(
      'detailWakifModalContent'
    );


  if (loading) {
    loading.style.display = 'block';
  }

  if (errorBox) {
    errorBox.style.display = 'none';
  }

  if (content) {
    content.style.display = 'none';
  }


  // -------------------------------------------------------
  // PANGGIL API
  // -------------------------------------------------------

  fetch(
    SIWAK_API_URL +
    '?action=detailWakif&idWakif=' +
    encodeURIComponent(idWakif)
  )

    .then(
      function (response) {

        if (!response.ok) {

          throw new Error(
            'Gagal menghubungi API.'
          );

        }

        return response.json();

      }
    )

    .then(
      function (result) {

        if (
          !result.success ||
          !result.data
        ) {

          throw new Error(
            result.message ||
            'Detail wakif tidak ditemukan.'
          );

        }


        tampilkanDetailWakif(
          result.data
        );


        if (loading) {
          loading.style.display = 'none';
        }

        if (content) {
          content.style.display = 'block';
        }

      }
    )

    .catch(
      function (error) {

        console.error(
          'ERROR DETAIL WAKIF:',
          error
        );


        if (loading) {
          loading.style.display = 'none';
        }

        if (content) {
          content.style.display = 'none';
        }

        if (errorBox) {

          errorBox.style.display =
            'block';


          const message =
            document.getElementById(
              'detailWakifModalErrorMessage'
            );


          if (message) {

            message.textContent =
              error.message;

          }

        }

      }
    );

}

/* =========================================================
   TUTUP DETAIL DATA WAKIF
========================================================= */

function tutupDetailWakif() {

  const modal =
    document.getElementById(
      'detailWakifModal'
    );

  if (!modal) return;

  modal.classList.remove('show');

  modal.setAttribute(
    'aria-hidden',
    'true'
  );
}

/* =========================================================
   RENDER PAGINATION DATA WAKIF
   ========================================================= */

function renderPaginationWakif(totalData) {

  const pagination =
    document.getElementById(
      'paginationWakif'
    );

  if (!pagination) return;


  const totalPages =
    Math.ceil(
      totalData / rowsPerPageWakif
    );


  // Tidak perlu pagination jika data 10 atau kurang
  if (totalPages <= 1) {

    pagination.innerHTML = '';

    return;
  }


  let html = '';


  // TOMBOL SEBELUMNYA
  html += `
    <button
      type="button"
      class="pagination-btn"
      onclick="changePageWakif(${currentPageWakif - 1})"
      ${currentPageWakif === 1 ? 'disabled' : ''}>
      Sebelumnya
    </button>
  `;


  // NOMOR HALAMAN
  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {

    html += `
      <button
        type="button"
        class="pagination-btn ${
          i === currentPageWakif
            ? 'active'
            : ''
        }"
        onclick="changePageWakif(${i})">
        ${i}
      </button>
    `;

  }


  // TOMBOL BERIKUTNYA
  html += `
    <button
      type="button"
      class="pagination-btn"
      onclick="changePageWakif(${currentPageWakif + 1})"
      ${
        currentPageWakif === totalPages
          ? 'disabled'
          : ''
      }>
      Berikutnya
    </button>
  `;


  pagination.innerHTML = html;

}

/* =========================================================
   TAMPILKAN DETAIL DATA WAKIF
========================================================= */

function tampilkanDetailWakif(data) {

  document.getElementById('detailIdWakif').textContent =
    data.idWakif || '-';

  document.getElementById('detailNamaWakif').textContent =
    data.namaWakif || '-';

  document.getElementById('detailJenisWakif').textContent =
    data.jenisWakif || '-';

  document.getElementById('detailJenisWakifText').textContent =
    data.jenisWakif || '-';

  document.getElementById('detailKabKotaWakif').textContent =
    data.kabKota || '-';

  document.getElementById('detailKecamatanWakif').textContent =
    data.kecamatan || '-';

  document.getElementById('detailDesaWakif').textContent =
    data.desaKelurahan || '-';

  document.getElementById('detailAlamatWakif').textContent =
    data.alamat || '-';

  document.getElementById('detailKeteranganWakif').textContent =
    data.keterangan || '-';


  // -------------------------------------------------------
  // JUMLAH WAKAF
  // -------------------------------------------------------

  const jumlahWakaf =
    data.jumlahWakaf ?? 0;

  document.getElementById('detailJumlahWakaf').textContent =
    jumlahWakaf;

  document.getElementById('detailJumlahWakafLabel').textContent =
    jumlahWakaf + ' wakaf';


  // -------------------------------------------------------
  // DAFTAR WAKAF
  // -------------------------------------------------------

  const list =
    document.getElementById(
      'detailWakifWakafList'
    );

  if (!list) {
    return;
  }

  const daftarWakaf =
    data.daftarWakaf || [];


  // -------------------------------------------------------
  // BELUM ADA DATA WAKAF
  // -------------------------------------------------------

  if (daftarWakaf.length === 0) {

    list.innerHTML = `
      <div class="detail-empty-state">
        Belum ada data wakaf dari wakif ini.
      </div>
    `;

    return;
  }


  // -------------------------------------------------------
  // TAMPILKAN DAFTAR WAKAF
  // -------------------------------------------------------

  list.innerHTML =
    daftarWakaf
      .map(
        function (wakaf) {

          return `
            <div
  class="detail-wakaf-item"
  onclick="detailWakaf('${wakaf.idWakaf}')"
  style="cursor:pointer;"
>

              <div class="detail-wakaf-item-header">

                <strong>
                  ${wakaf.kodeWakaf || '-'}
                </strong>

                <span class="status-badge">
                  ${wakaf.statusSertifikasi || '-'}
                </span>

              </div>


              <div class="detail-wakaf-item-grid">

                <div>
                  <span>Jenis Aset</span>
                  <strong>
                    ${wakaf.jenisAset || '-'}
                  </strong>
                </div>


                <div>
                  <span>Luas</span>
                  <strong>
                    ${wakaf.luas ?? '-'}
                    ${wakaf.satuanLuas || ''}
                  </strong>
                </div>


                <div>
                  <span>Tahun Wakaf</span>
                  <strong>
                    ${wakaf.tahunWakaf || '-'}
                  </strong>
                </div>


                <div>
                  <span>Nomor AIW/APAIW</span>
                  <strong>
                    ${wakaf.nomorAiwApaiw || '-'}
                  </strong>
                </div>


                <div>
                  <span>Nomor Sertifikat</span>
                  <strong>
                    ${wakaf.nomorSertifikat || '-'}
                  </strong>
                </div>

              </div>

            </div>
          `;

        }
      )
      .join('');

}

/* =========================================================
   DETAIL WAKAF DARI MODAL WAKIF
========================================================= */

function detailWakaf(idWakaf) {

  if (!idWakaf) {
    return;
  }

  lihatDetailWakaf(idWakaf);

}

/* =========================================================
   GANTI HALAMAN DATA WAKIF
   ========================================================= */

function changePageWakif(page) {

  const totalPages =
    Math.ceil(
      dataWakifTampil.length /
      rowsPerPageWakif
    );


  if (
    page < 1 ||
    page > totalPages
  ) {
    return;
  }


  currentPageWakif = page;


  renderDataWakif(
    dataWakifTampil
  );

}

/* =========================================================
   TERAPKAN FILTER DATA WAKIF
   ========================================================= */

function terapkanFilterWakif() {

  const filterKabKota =
    document.getElementById(
      'filterKabKotaWakif'
    )?.value || '';


  const filterJenisWakif =
    document.getElementById(
      'filterJenisWakif'
    )?.value || '';


  const search =
    (
      document.getElementById(
        'searchWakif'
      )?.value || ''
    )
      .trim()
      .toLowerCase();


  const semuaData =
    window.semuaDataWakif || [];


  const hasilFilter =
    semuaData.filter(
      function (item) {

        /* -----------------------------------------
           KABUPATEN / KOTA
           ----------------------------------------- */

        const nilaiKabKota =
          String(
            item.kabKota || ''
          )
            .trim();


        const cocokKabKota =
          filterKabKota === '' ||
          nilaiKabKota === filterKabKota;


        /* -----------------------------------------
           JENIS WAKIF
           ----------------------------------------- */

        const nilaiJenisWakif =
          String(
            item.jenisWakif || ''
          )
            .trim()
            .toUpperCase();


        const pilihanJenisWakif =
          String(
            filterJenisWakif || ''
          )
            .trim()
            .toUpperCase();


        const cocokJenisWakif =
          pilihanJenisWakif === '' ||
          nilaiJenisWakif === pilihanJenisWakif;


        /* -----------------------------------------
           PENCARIAN
           ----------------------------------------- */

        const teksPencarian =
          [
            item.idWakif,
            item.namaWakif,
            item.jenisWakif,
            item.nik,
            item.alamat,
            item.kabKota,
            item.kecamatan,
            item.desaKelurahan,
            item.kontak,
            item.keterangan
          ]
            .map(
              function (value) {

                return String(
                  value || ''
                )
                  .trim()
                  .toLowerCase();

              }
            )
            .join(' ');


        const cocokPencarian =
          search === '' ||
          teksPencarian.includes(
            search
          );


        /* -----------------------------------------
           HASIL AKHIR
           SEMUA FILTER HARUS COCOK
           ----------------------------------------- */

        return (
          cocokKabKota &&
          cocokJenisWakif &&
          cocokPencarian
        );

      }
    );


  /* -----------------------------------------
     KEMBALI KE HALAMAN 1
     ----------------------------------------- */

  currentPageWakif = 1;


  renderDataWakif(
    hasilFilter
  );

}

document.addEventListener('DOMContentLoaded', function () {

  const filterKabKotaWakif =
    document.getElementById(
      'filterKabKotaWakif'
    );

  const filterJenisWakif =
    document.getElementById(
      'filterJenisWakif'
    );

  const searchWakif =
    document.getElementById(
      'searchWakif'
    );


  if (filterKabKotaWakif) {

    filterKabKotaWakif.addEventListener(
      'change',
      terapkanFilterWakif
    );

  }


  if (filterJenisWakif) {

    filterJenisWakif.addEventListener(
      'change',
      terapkanFilterWakif
    );

  }


  if (searchWakif) {

    searchWakif.addEventListener(
      'input',
      terapkanFilterWakif
    );

  }

  loadDataNazhir();
});

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


  const startIndex =
    (currentPage - 1) * rowsPerPage;


  const pageData =
    data.slice(
      startIndex,
      startIndex + rowsPerPage
    );


  tbody.innerHTML =
    pageData.map(function (item, index) {

      return `
        <tr>

          <td>
            ${(currentPage - 1) * rowsPerPage + index + 1}
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

function renderPagination(totalData) {

  const container =
    document.getElementById('paginationContainer');

  if (!container) {
    return;
  }

  const totalPages =
    Math.ceil(totalData / rowsPerPage);

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  html += `
    <button
      type="button"
      onclick="changePage(${currentPage - 1})"
      ${currentPage === 1 ? 'disabled' : ''}
    >
      Sebelumnya
    </button>
  `;

  for (let page = 1; page <= totalPages; page++) {

    html += `
      <button
        type="button"
        class="${page === currentPage ? 'active' : ''}"
        onclick="changePage(${page})"
      >
        ${page}
      </button>
    `;

  }

  html += `
    <button
      type="button"
      onclick="changePage(${currentPage + 1})"
      ${currentPage === totalPages ? 'disabled' : ''}
    >
      Berikutnya
    </button>
  `;

  container.innerHTML = html;
}

function changePage(page) {

  const totalPages =
    Math.ceil(
      dataWakafTampil.length / rowsPerPage
    );

  if (
    page < 1 ||
    page > totalPages
  ) {
    return;
  }

  currentPage = page;

  renderDataWakaf(
    dataWakafTampil
  );

  renderPagination(
    dataWakafTampil.length
  );

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
   FILTER DATA WAKAF
   ========================================================= */

function isiFilterKabKota(data) {

  const select =
    document.getElementById('filterKabKota');

  if (!select) {
    return;
  }

  const daftarKabKota =
    [...new Set(
      data
        .map(function (item) {
          return String(
            item.kabKota || ''
          ).trim();
        })
        .filter(function (value) {
          return value !== '';
        })
    )]
    .sort(function (a, b) {
      return a.localeCompare(
        b,
        'id'
      );
    });

  select.innerHTML = `
    <option value="">
      Semua Kabupaten / Kota
    </option>
  `;

  daftarKabKota.forEach(
    function (kabKota) {

      const option =
        document.createElement('option');

      option.value = kabKota;
      option.textContent = kabKota;

      select.appendChild(option);

    }
  );

}

/* =========================================================
   FILTER KABUPATEN / KOTA DATA WAKIF
   ========================================================= */

function isiFilterKabKotaWakif(data) {

  const select =
    document.getElementById(
      'filterKabKotaWakif'
    );

  if (!select) {
    return;
  }

  const daftarKabKota =
    [...new Set(
      data
        .map(function (item) {
          return String(
            item.kabKota || ''
          ).trim();
        })
        .filter(function (value) {
          return value !== '';
        })
    )]
    .sort(function (a, b) {
      return a.localeCompare(
        b,
        'id'
      );
    });

  select.innerHTML = `
    <option value="">
      Semua Kabupaten / Kota
    </option>
  `;

  daftarKabKota.forEach(
    function (kabKota) {

      const option =
        document.createElement('option');

      option.value = kabKota;
      option.textContent = kabKota;

      select.appendChild(option);

    }
  );

}

/* =========================================================
   TERAPKAN FILTER
   ========================================================= */

function terapkanFilterWakaf() {

  const filterKabKota =
    document.getElementById(
      'filterKabKota'
    )?.value || '';

  const filterJenisAset =
    document.getElementById(
      'filterJenisAset'
    )?.value || '';

  const filterSertifikasi =
    document.getElementById(
      'filterSertifikasi'
    )?.value || '';

  const search =
    (
      document.getElementById(
        'searchWakaf'
      )?.value || ''
    )
      .trim()
      .toLowerCase();

currentPage = 1;
   
  const hasilFilter =
    semuaDataWakaf.filter(
      function (item) {

        const cocokKabKota =
          !filterKabKota ||
          String(
            item.kabKota || ''
          ) === filterKabKota;


        const cocokJenisAset =
          !filterJenisAset ||
          String(
            item.jenisAset || ''
          ).toUpperCase() ===
          filterJenisAset;


        const cocokSertifikasi =
          !filterSertifikasi ||
          String(
            item.statusSertifikasi || ''
          ).toUpperCase() ===
          filterSertifikasi;


        const teksPencarian =
          [
            item.idWakaf,
            item.kodeWakaf,
            item.jenisAset,
            item.peruntukan,
            item.kabKota
          ]
            .map(function (value) {
              return String(
                value || ''
              ).toLowerCase();
            })
            .join(' ');


        const cocokPencarian =
          !search ||
          teksPencarian.includes(
            search
          );


        return (
          cocokKabKota &&
          cocokJenisAset &&
          cocokSertifikasi &&
          cocokPencarian
        );

      }
    );

dataWakafTampil = hasilFilter;

  renderDataWakaf(
    hasilFilter
  );
renderPagination(
    hasilFilter.length
  );
   
}

/* =========================================================
   EVENT FILTER DATA WAKAF
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  function () {

    const filterKabKota =
      document.getElementById(
        'filterKabKota'
      );

    const filterJenisAset =
      document.getElementById(
        'filterJenisAset'
      );

    const filterSertifikasi =
      document.getElementById(
        'filterSertifikasi'
      );

    const searchWakaf =
      document.getElementById(
        'searchWakaf'
      );


    if (filterKabKota) {

      filterKabKota.addEventListener(
        'change',
        terapkanFilterWakaf
      );

    }


    if (filterJenisAset) {

      filterJenisAset.addEventListener(
        'change',
        terapkanFilterWakaf
      );

    }


    if (filterSertifikasi) {

      filterSertifikasi.addEventListener(
        'change',
        terapkanFilterWakaf
      );

    }


    if (searchWakaf) {

      searchWakaf.addEventListener(
        'input',
        terapkanFilterWakaf
      );

    }

  }
);


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

   loading.textContent = 'Memuat detail wakaf...';

  errorBox.style.display =
    'none';


  try {
console.time('WAKTU API DETAIL WAKAF');
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

console.timeEnd('WAKTU API DETAIL WAKAF');
     
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


   renderDetailWakafModal(result.data);

loading.style.display = 'none';
content.style.display = 'block';


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
  'detailWakafNamaWakif'
).textContent =
  wakif.nama ||
  '-';


document.getElementById(
  'detailWakafJenisWakif'
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

  // Buat peta
  detailWakafMap =
  L.map('detailWakafMap', {
    scrollWheelZoom: false
  });

  // OpenStreetMap
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution:
        '&copy; OpenStreetMap contributors'
    }
  ).addTo(detailWakafMap);

  // Posisi awal
  detailWakafMap.setView(
    [latitude, longitude],
    16
  );

  // Marker
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

  // Perbaiki ukuran setelah modal tampil
  setTimeout(function () {

    if (detailWakafMap) {

      detailWakafMap.invalidateSize(true);

      detailWakafMap.setView(
        [latitude, longitude],
        16
      );

    }

  }, 300);

}

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

loadDataWakif();
