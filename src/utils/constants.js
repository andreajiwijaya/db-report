// ============================================================
// KONFIGURASI UTAMA — SESUAIKAN SEBELUM RUN/DEPLOY
// ============================================================

// Ambil URL CSV dari environment supaya dev tidak bergantung pada placeholder.
export const SHEET_XLSX_URL = import.meta.env.VITE_SHEET_XLSX_URL?.trim() || ''

export const isSheetCsvUrlConfigured =
  SHEET_XLSX_URL !== '' && !SHEET_XLSX_URL.includes('YOUR_SHEET_ID')

// 2. Mapping nama kolom dari Google Form ke variabel internal
//    Sesuaikan dengan header kolom di Google Sheets kamu
export const COL = {
  TIMESTAMP: 'Timestamp',
  UP3: 'NAMA UNIT',
  JUDUL: 'Judul Siaran Pers',
  TIPE: 'Tipe Siaran Pers',
  TANGGAL: 'Periode Siaran Pers (di isi sesuai periode bulan siaran pers)',
  LINK_PREFIX: 'Link eviden Pemuatan Media Lokal',
}

// 3. Daftar UP3 (sesuaikan dengan pilihan di Google Form)
export const UP3_LIST = [
  { id: 'pekanbaru',      label: 'UP3 Pekanbaru',       area: 'Pekanbaru' },
  { id: 'dumai',          label: 'UP3 Dumai',            area: 'Dumai' },
  { id: 'rengat',         label: 'UP3 Rengat',           area: 'Indragiri Hulu' },
  { id: 'tanjungpinang',  label: 'UP3 Tanjung Pinang',  area: 'Bintan' },
  { id: 'bangkinang',     label: 'UP3 Bangkinang',      area: 'Kampar' },
  { id: 'up2d-riau',      label: 'UP2D Riau',           area: 'Riau' },
  { id: 'up2k-riau',      label: 'UP2K Riau',           area: 'Riau' },
  { id: 'up2k-kepri',     label: 'UP2K Kepri',          area: 'Kepulauan Riau' },
]

// Helper: ambil UP3 by id
export const getUP3ById = (id) => UP3_LIST.find((u) => u.id === id)

// Helper: normalisasi nama UP3 dari Google Form → id internal
// Sesuaikan jika teks di GForm berbeda (case-insensitive)
export const normalizeUP3 = (raw = '') => {
  const lower = raw.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const u of UP3_LIST) {
    const normalizedId = u.id.replace(/[^a-z0-9]/g, '')
    const normalizedLabel = u.label.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (lower.includes(normalizedId)) return u.id
    if (lower.includes(normalizedLabel)) return u.id
  }
  return raw // fallback: kembalikan apa adanya
}

// Jumlah link per evidence
export const TOTAL_LINKS = 10
export const REQUIRED_LINKS = 6
export const MONTHLY_PUBLICATION_TARGET = 3

// Warna status
export const STATUS_COLOR = {
  lengkap:  { bg: 'bg-emerald-100', text: 'text-emerald-800', bar: '#10b981' },
  sebagian: { bg: 'bg-amber-100',   text: 'text-amber-800',   bar: '#f59e0b' },
  kosong:   { bg: 'bg-slate-100',   text: 'text-slate-800',   bar: '#94a3b8' },
}

export const getStatus = (linkCount) => {
  if (linkCount >= REQUIRED_LINKS) return 'lengkap'
  if (linkCount === 0) return 'kosong'
  return 'sebagian'
}

export const getStatusLabel = (status) => {
  return { lengkap: 'Sudah lengkap', sebagian: 'Perlu dilengkapi', kosong: 'Belum ada tautan' }[status] ?? 'Status tidak diketahui'
}
