/* =========================================================
   WEB BIOGRAFI — js/main.js
   Pemrograman I / Proyek Website

   DAFTAR ISI
   1. Konstanta dan konfigurasi
   2. State aplikasi
   3. Utilitas: validasi dan localStorage
   4. Penerapan preferensi ke <html>
   5. Status pengaturan
   6. Formulir preferensi (simpan dan atur ulang)
   7. Navigasi responsif
   8. Tahun footer
   9. Inisialisasi
   ========================================================= */

(() => {
  "use strict";

  /* Tandai bahwa JavaScript aktif. CSS memakai kelas ini agar menu
     mobile hanya disembunyikan bila skrip benar-benar berjalan. */
  document.documentElement.classList.add("js");


  /* =======================================================
     1. KONSTANTA DAN KONFIGURASI
     ======================================================= */

  const STORAGE_KEY = "webBiografi.preferences";

  /* Nilai bawaan harus sama dengan atribut `checked` pada HTML
     dan nilai bawaan pada CSS (Dark, Medium, Active). */
  const DEFAULT_PREFERENCES = Object.freeze({
    theme: "dark",
    textSize: "medium",
    animation: "active",
  });

  /* Daftar nilai yang diizinkan untuk setiap preferensi. */
  const ALLOWED_VALUES = Object.freeze({
    theme: ["light", "dark"],
    textSize: ["small", "medium", "large"],
    animation: ["active", "reduced", "inactive"],
  });

  /* Pemetaan kunci preferensi ke atribut data-* pada <html>. */
  const HTML_ATTRIBUTES = Object.freeze({
    theme: "data-theme",
    textSize: "data-text-size",
    animation: "data-animation",
  });

  /* Pemetaan kunci preferensi ke atribut name pada radio button. */
  const RADIO_NAMES = Object.freeze({
    theme: "theme",
    textSize: "text-size",
    animation: "animation",
  });

  const MESSAGES = Object.freeze({
    unchanged: "Pengaturan belum diubah.",
    saved: "Pengaturan berhasil disimpan.",
    reset: "Pengaturan berhasil diatur ulang.",
    temporary: "Pengaturan diterapkan sementara karena penyimpanan tidak tersedia.",
    corrected: "Sebagian pilihan tidak valid, nilai bawaan digunakan.",
  });

  const OPEN_LABEL = "Buka navigasi";
  const CLOSE_LABEL = "Tutup navigasi";

  /* Harus sama dengan breakpoint menu mobile di CSS (max-width: 900px). */
  const MOBILE_BREAKPOINT = 900;


  /* =======================================================
     2. STATE APLIKASI
     ======================================================= */

  const state = {
    /* Preferensi yang sedang diterapkan pada halaman. */
    preferences: { ...DEFAULT_PREFERENCES },
    /* True bila preferensi ini sudah tersimpan di localStorage. */
    persisted: false,
  };

  let formElement = null;
  let statusElement = null;


  /* =======================================================
     3. UTILITAS: VALIDASI DAN LOCALSTORAGE
     ======================================================= */

  /**
   * Memvalidasi kandidat preferensi. Nilai yang tidak valid
   * diganti dengan nilai bawaan. Data tidak pernah dipercaya
   * begitu saja (localStorage dapat diubah pengguna).
   */
  function sanitizePreferences(candidate) {
    const source =
      candidate !== null && typeof candidate === "object" && !Array.isArray(candidate)
        ? candidate
        : {};

    const preferences = {};
    let corrected = false;

    Object.keys(DEFAULT_PREFERENCES).forEach((key) => {
      const value = source[key];

      if (typeof value === "string" && ALLOWED_VALUES[key].includes(value)) {
        preferences[key] = value;
      } else {
        preferences[key] = DEFAULT_PREFERENCES[key];
        corrected = true;
      }
    });

    return { preferences, corrected };
  }

  function arePreferencesEqual(a, b) {
    return Object.keys(DEFAULT_PREFERENCES).every((key) => a[key] === b[key]);
  }

  /**
   * Membaca preferensi dari localStorage.
   * Aman terhadap storage yang diblokir, kosong, atau rusak.
   */
  function loadPreferences() {
    let raw = null;

    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return { preferences: { ...DEFAULT_PREFERENCES }, persisted: false };
    }

    if (raw === null) {
      return { preferences: { ...DEFAULT_PREFERENCES }, persisted: false };
    }

    let parsed = null;

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      parsed = null;
    }

    const { preferences, corrected } = sanitizePreferences(parsed);

    return { preferences, persisted: !corrected };
  }

  /**
   * Menyimpan seluruh preferensi sebagai satu objek JSON.
   * Mengembalikan true bila berhasil, false bila gagal.
   */
  function savePreferences(preferences) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      return false;
    }
  }


  /* =======================================================
     4. PENERAPAN PREFERENSI KE <html>
     ======================================================= */

  /**
   * Menerapkan preferensi melalui atribut data-* pada <html>.
   * HTML sumber tidak diubah; hanya atribut runtime yang diatur.
   */
  function applyPreferences(preferences) {
    const root = document.documentElement;

    Object.keys(HTML_ATTRIBUTES).forEach((key) => {
      root.setAttribute(HTML_ATTRIBUTES[key], preferences[key]);
    });

    state.preferences = { ...preferences };
  }

  /** Menyelaraskan radio button dengan preferensi yang aktif. */
  function syncForm(preferences) {
    if (!formElement) return;

    Object.keys(RADIO_NAMES).forEach((key) => {
      const radio = formElement.querySelector(
        `input[type="radio"][name="${RADIO_NAMES[key]}"][value="${preferences[key]}"]`
      );

      if (radio) {
        radio.checked = true;
      }
    });
  }

  /** Mengambil pilihan pengguna saat ini dari formulir. */
  function readForm() {
    if (!formElement) return { ...state.preferences };

    const data = new FormData(formElement);

    return {
      theme: data.get(RADIO_NAMES.theme),
      textSize: data.get(RADIO_NAMES.textSize),
      animation: data.get(RADIO_NAMES.animation),
    };
  }


  /* =======================================================
     5. STATUS PENGATURAN
     ======================================================= */

  /**
   * Menampilkan pesan pada #preferences-status.
   * Elemen sudah memiliki role="status" dan aria-live="polite",
   * sehingga perubahan teks otomatis diumumkan pembaca layar.
   */
  function setStatus(message, status = "idle") {
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.setAttribute("data-state", status);

    /* Mulai ulang animasi sorot singkat (dimatikan CSS pada
       mode reduced/inactive dan prefers-reduced-motion). */
    statusElement.classList.remove("is-flash");
    void statusElement.offsetWidth;
    statusElement.classList.add("is-flash");
  }


  /* =======================================================
     6. FORMULIR PREFERENSI (SIMPAN DAN ATUR ULANG)
     ======================================================= */

  function handleSubmit(event) {
    /* Mencegah reload halaman. */
    event.preventDefault();

    /* 1-2. Ambil seluruh pilihan dan validasi tiap nilai. */
    const { preferences, corrected } = sanitizePreferences(readForm());

    /* Tidak ada perubahan dibanding pengaturan yang sudah tersimpan. */
    if (!corrected && state.persisted && arePreferencesEqual(preferences, state.preferences)) {
      setStatus(MESSAGES.unchanged, "idle");
      return;
    }

    /* 3-5. Terapkan tema, ukuran teks, dan mode animasi. */
    applyPreferences(preferences);
    syncForm(preferences);

    /* 6. Simpan semua preferensi dalam satu objek. */
    const stored = savePreferences(preferences);
    state.persisted = stored;

    /* 7. Tampilkan pesan yang sesuai. */
    if (!stored) {
      setStatus(MESSAGES.temporary, "warning");
    } else if (corrected) {
      setStatus(MESSAGES.corrected, "warning");
    } else {
      setStatus(MESSAGES.saved, "success");
    }
  }

  function handleReset() {
    const defaults = { ...DEFAULT_PREFERENCES };

    applyPreferences(defaults);
    syncForm(defaults);

    const stored = savePreferences(defaults);
    state.persisted = stored;

    if (stored) {
      setStatus(MESSAGES.reset, "reset");
    } else {
      setStatus(MESSAGES.temporary, "warning");
    }
  }

  /** Sinkronisasi ulang bila pengaturan diubah dari tab lain. */
  function handleStorageEvent(event) {
    if (event.key !== null && event.key !== STORAGE_KEY) return;

    const { preferences, persisted } = loadPreferences();

    applyPreferences(preferences);
    syncForm(preferences);
    state.persisted = persisted;
  }

  function initPreferencesForm() {
    formElement = document.getElementById("preferences-form");
    statusElement = document.getElementById("preferences-status");

    if (!formElement) return;

    const resetButton = document.getElementById("reset-preferences");

    /* Tombol #save-preferences bertipe submit, sehingga
       penyimpanan ditangani oleh event submit formulir. */
    formElement.addEventListener("submit", handleSubmit);

    if (resetButton) {
      resetButton.addEventListener("click", handleReset);
    }

    window.addEventListener("storage", handleStorageEvent);

    /* Browser dapat memulihkan pilihan radio lama saat halaman
       dimuat ulang atau dipulihkan dari cache. Pilihan dikembalikan
       agar selalu mencerminkan preferensi yang aktif. */
    window.addEventListener("pageshow", () => syncForm(state.preferences));
  }


  /* =======================================================
     7. NAVIGASI RESPONSIF
     ======================================================= */

  function initNavigation() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("nav-menu");

    if (!toggle || !menu) return;

    const navbar = toggle.closest(".navbar") || menu.parentElement;
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    let isOpen = false;

    function setOpen(open, options = {}) {
      isOpen = open;

      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? CLOSE_LABEL : OPEN_LABEL);
      toggle.classList.toggle("is-open", open);
      menu.classList.toggle("is-open", open);

      if (!open && options.returnFocus) {
        toggle.focus();
      }
    }

    /* Buka dan tutup lewat tombol menu. */
    toggle.addEventListener("click", () => setOpen(!isOpen));

    /* Tutup setelah salah satu tautan dipilih. */
    menu.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        setOpen(false);
      }
    });

    /* Tutup dengan tombol Escape dan kembalikan fokus ke tombol menu. */
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        setOpen(false, { returnFocus: true });
      }
    });

    /* Tutup bila pengguna mengklik di luar navigasi. */
    document.addEventListener("click", (event) => {
      if (!isOpen || !(event.target instanceof Node)) return;

      if (navbar && !navbar.contains(event.target)) {
        setOpen(false);
      }
    });

    /* Tutup bila fokus keyboard berpindah ke luar navigasi. */
    if (navbar) {
      navbar.addEventListener("focusout", (event) => {
        if (isOpen && event.relatedTarget && !navbar.contains(event.relatedTarget)) {
          setOpen(false);
        }
      });
    }

    /* Reset menu saat layar berubah menjadi desktop,
       sehingga navigasi desktop tidak terganggu. */
    function handleViewportChange(event) {
      if (!event.matches) {
        setOpen(false);
      }
    }

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleViewportChange);
    } else if (typeof mobileQuery.addListener === "function") {
      mobileQuery.addListener(handleViewportChange);
    }

    /* Keadaan awal selalu tertutup. */
    setOpen(false);
  }


  /* =======================================================
     8. TAHUN FOOTER
     ======================================================= */

  function updateFooterYear() {
    const yearElement = document.getElementById("current-year");

    if (!yearElement) return;

    yearElement.textContent = String(new Date().getFullYear());
  }


  /* =======================================================
     9. INISIALISASI
     ======================================================= */

  function init() {
    /* 1. Navigasi. */
    initNavigation();

    /* Hubungkan formulir dan elemen status (aman bila tidak ada). */
    initPreferencesForm();

    /* 2-3. Baca preferensi dari localStorage dan validasi. */
    const { preferences, persisted } = loadPreferences();

    /* 4. Terapkan preferensi (atau nilai bawaan). */
    applyPreferences(preferences);
    state.persisted = persisted;

    /* 5. Sinkronkan radio button. */
    syncForm(preferences);

    /* 6. Perbarui tahun footer. */
    updateFooterYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();