import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { COL, REQUIRED_LINKS, TOTAL_LINKS, MONTHLY_PUBLICATION_TARGET, getStatus, normalizeUP3 } from './constants'

// Mock data untuk development jika fetch gagal
const MOCK_CSV = `${COL.TIMESTAMP},${COL.UP3},${COL.JUDUL},${COL.TANGGAL},${Array.from({ length: TOTAL_LINKS }, (_, i) => `${COL.LINK_PREFIX} (${i + 1})`).join(',')}
2026-05-01 10:00,UP3 Pekanbaru,Verifikasi Dokumen Program Kerja Bulanan,2026-05-01,https://example.com/1,https://example.com/2,https://example.com/3,https://example.com/4,https://example.com/5,https://example.com/6
2026-05-02 11:00,UP3 Dumai,Monitoring Progress Tindak Lanjut Temuan,2026-05-02,https://example.com/1,https://example.com/2,,,,
2026-05-03 12:00,UP3 Rengat,Rekap Bukti Pelaksanaan Agenda Lapangan,2026-05-03,https://example.com/1,https://example.com/2,https://example.com/3,,,
2026-05-04 13:00,UP2D Riau,Validasi Kelengkapan Laporan Unit,2026-05-04,https://example.com/1,https://example.com/2,https://example.com/3,https://example.com/4,,
2026-05-05 14:00,UP3 Tanjung Pinang,Review Dokumen Pendukung Rapat Koordinasi,2026-05-05,https://example.com/1,https://example.com/2,https://example.com/3,https://example.com/4,https://example.com/5,
2026-05-06 15:00,UP3 Bangkinang,Pemeriksaan Upload Evidence Periode Berjalan,2026-05-06,https://example.com/1,,,,,
2026-04-25 09:00,UP3 Pekanbaru,Penyampaian Bukti Realisasi Program April,2026-04-25,https://example.com/1,https://example.com/2,https://example.com/3,https://example.com/4,https://example.com/5,https://example.com/6
2026-04-26 10:00,UP3 Dumai,Koordinasi Kelengkapan Data Monitoring,2026-04-26,https://example.com/1,https://example.com/2,https://example.com/3,https://example.com/4,,
2026-04-27 11:00,UP3 Rengat,Update Status Evidence Lapangan,2026-04-27,https://example.com/1,https://example.com/2,https://example.com/3,,,
2026-04-28 12:00,UP2D Riau,Verifikasi Berkas Pelaksanaan Kegiatan,2026-04-28,https://example.com/1,https://example.com/2,,,
2026-04-29 13:00,UP3 Tanjung Pinang,Rekap Link Pendukung Laporan Bulanan,2026-04-29,https://example.com/1,,,,
2026-04-30 14:00,UP3 Bangkinang,Pengumpulan Evidence Final Periode April,2026-04-30,https://example.com/1,https://example.com/2,https://example.com/3,https://example.com/4,https://example.com/5,https://example.com/6
2026-04-10 08:00,UP3 Pekanbaru,Audit Kelengkapan Bukti Monitoring,2026-04-10,https://example.com/1,https://example.com/2,https://example.com/3,https://example.com/4,https://example.com/5,
2026-04-11 09:00,UP3 Dumai,Pemeriksaan Ketersediaan Dokumen Pendukung,2026-04-11,https://example.com/1,https://example.com/2,https://example.com/3,https://example.com/4,,
2026-04-12 10:00,UP3 Rengat,Rekap Evidence Semester Berjalan,2026-04-12,https://example.com/1,https://example.com/2,https://example.com/3,https://example.com/4,https://example.com/5,https://example.com/6
2026-04-13 11:00,UP2D Riau,Konfirmasi Data Program dan Evidence,2026-04-13,https://example.com/1,https://example.com/2,https://example.com/3,https://example.com/4,https://example.com/5,https://example.com/6
2026-04-14 12:00,UP3 Tanjung Pinang,Monitoring Pengiriman Bukti Kegiatan,2026-04-14,https://example.com/1,https://example.com/2,https://example.com/3,,,
2026-04-15 13:00,UP3 Bangkinang,Validasi Evidence Masuk ke Sistem,2026-04-15,https://example.com/1,,,,,
`

/**
 * Fetch dan parse XLSX dari Google Sheets.
 * XLSX dipakai karena endpoint CSV/gviz pada spreadsheet ini hanya mengembalikan
 * sebagian baris meskipun workbook memiliki seluruh data.
 * @param {string} url - URL export XLSX dari Google Sheets
 * @returns {Promise<Array>} Array of evidence objects
 */
export async function fetchSheetData(url) {
  // Mock hanya dipakai saat URL belum dikonfigurasi untuk membantu pengembangan lokal.
  if (!url || url.includes('your-sheet-id')) {
    console.warn('URL Google Sheets belum dikonfigurasi; menggunakan data contoh.')
    return parseCSV(MOCK_CSV)
  }

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Gagal fetch data: ${res.status} ${res.statusText}`)
    const workbook = XLSX.read(await res.arrayBuffer(), { type: 'array', cellDates: false })
    return parseWorkbook(workbook)
  } catch (e) {
    throw new Error(`Gagal mengambil data Google Sheets: ${e.message}`, { cause: e })
  }
}

/**
 * Parse workbook Google Sheets dan pertahankan seluruh baris data, termasuk
 * baris yang tidak memiliki link atau tanggal periode.
 */
export function parseWorkbook(workbook) {
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) throw new Error('Workbook Google Sheets tidak memiliki tab data.')

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    header: 1,
    defval: '',
    raw: false,
  })
  const headers = rows[0] || []
  if (!headers.includes(COL.UP3) || !headers.includes(COL.JUDUL)) {
    throw new Error('Struktur kolom spreadsheet tidak sesuai dengan format siaran pers.')
  }

  return rows
    .slice(1)
    .map((values, index) => {
      const row = Object.fromEntries(headers.map((header, columnIndex) => [header, values[columnIndex] ?? '']))
      return normalizeRow(row, index)
    })
    .filter(Boolean)
}


/**
 * Parse raw CSV string → array of normalized evidence objects
 */
export function parseCSV(csvText) {
  const { data, errors } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    trimHeaders: true,
  })

  if (errors.length > 0) {
    console.warn('CSV parse warnings:', errors)
  }

  return data
    .map((row, index) => normalizeRow(row, index))
    .filter(Boolean)
}

/**
 * Normalisasi satu baris CSV → object evidence
 */
function normalizeRow(row, index) {
  try {
    const links = Array.from({ length: TOTAL_LINKS }, (_, i) => {
      const value = row[`${COL.LINK_PREFIX} (${i + 1})`] || ''
      return value.trim() === '-' ? '' : value.trim()
    })

    const filledLinks = links.filter((l) => l.trim() !== '')
    const linkCount = filledLinks.length
    const requiredLinkCount = links.slice(0, REQUIRED_LINKS).filter((l) => l.trim() !== '').length

    const rawUp3 = row[COL.UP3] || ''
    const up3Id = normalizeUP3(rawUp3)

    const rawTanggal = row[COL.TANGGAL] || row[COL.TIMESTAMP] || ''
    const tanggal = parseTanggal(rawTanggal)
    const timestamp = row[COL.TIMESTAMP] || ''
    const timestampDate = parseTimestamp(timestamp)

    return {
      id: index,
      up3: up3Id,
      up3Raw: rawUp3,
      judul: (row[COL.JUDUL] || '').trim(),
      tipe: (row[COL.TIPE] || '').trim(),
      tanggal,
      tanggalRaw: rawTanggal,
      links,
      linkCount,
      requiredLinkCount,
      status: getStatus(linkCount),
      timestamp,
      timestampDate,
    }
  } catch (e) {
    console.warn(`Baris ${index} gagal dinormalisasi:`, e)
    return null
  }
}

/**
 * Parse berbagai format tanggal → Date object
 */
function parseTanggal(raw) {
  if (!raw) return null
  const value = String(raw).trim()
  const indonesianDate = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s|$)/)
  const d = indonesianDate
    ? new Date(Number(indonesianDate[3]), Number(indonesianDate[2]) - 1, Number(indonesianDate[1]))
    : new Date(value)
  return isNaN(d.getTime()) ? null : d
}

function parseTimestamp(raw) {
  if (!raw) return null
  if (raw instanceof Date) return isNaN(raw.getTime()) ? null : raw

  const value = String(raw).trim()
  if (!value) return null

  // Excel serial date, in case the workbook returns a numeric timestamp.
  if (/^\d+(?:\.\d+)?$/.test(value)) {
    const serial = Number(value)
    if (serial > 20000 && serial < 100000) {
      const date = new Date(Date.UTC(1899, 11, 30) + serial * 86400000)
      return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes())
    }
  }

  const dateParts = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+|T|$)(.*)$/)
  if (dateParts) {
    // Google Forms timestamps are exported as M/D/YYYY HH:mm:ss.
    const [, month, day, year, time = ''] = dateParts
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (!isNaN(date.getTime())) {
      const timeParts = time.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)
      if (timeParts) {
        date.setHours(Number(timeParts[1]), Number(timeParts[2]), Number(timeParts[3] || 0), 0)
      }
      return date
    }
  }

  const parsed = new Date(value)
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Format Date → string Indonesia
 */
export function formatTanggal(date) {
  if (!date) return '-'
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTimestamp(timestamp) {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return String(timestamp)

  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Ambil daftar bulan unik dari data
 */
export function getUniqueBulan(data) {
  const map = new Map()
  data.forEach((d) => {
    const date = getPublicationDate(d)
    if (!date) return
    const key = getMonthKey(date)
    const label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    map.set(key, label)
  })
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([value, label]) => ({ value, label }))
}

export function getMonthKey(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function getPublicationDate(row) {
  return row.timestampDate || row.tanggal || null
}

export function getLatestMonthKey(data) {
  const latestDate = data
    .map(getPublicationDate)
    .filter(Boolean)
    .reduce((latest, date) => (!latest || date > latest ? date : latest), null)

  return getMonthKey(latestDate)
}

/**
 * Hitung statistik per UP3
 */
export function calcUP3Stats(data, up3Id) {
  const rows = data.filter((d) => d.up3 === up3Id)
  const total = rows.length
  const lengkap = rows.filter((d) => d.status === 'lengkap').length
  const sebagian = rows.filter((d) => d.status === 'sebagian').length
  const kosong = rows.filter((d) => d.status === 'kosong').length
  const totalLinks = rows.reduce((s, d) => s + d.linkCount, 0)
  const maxLinks = total * TOTAL_LINKS
  const pctLinks = maxLinks > 0 ? Math.round((totalLinks / maxLinks) * 100) : 0
  const pctLengkap = total > 0 ? Math.round((lengkap / total) * 100) : 0
  const months = new Set(
    rows
      .map(getPublicationDate)
      .filter(Boolean)
      .map(getMonthKey)
  ).size
  const publicationTarget = months * MONTHLY_PUBLICATION_TARGET
  const publicationCapaian = publicationTarget > 0 ? Math.round((total / publicationTarget) * 100) : 0

  return { total, lengkap, sebagian, kosong, totalLinks, maxLinks, pctLinks, pctLengkap, months, publicationTarget, publicationCapaian }
}

export function getMonthlyPublicationStats(data, up3Id) {
  const rows = data
    .filter((row) => row.up3 === up3Id)
    .map((row) => ({ row, date: getPublicationDate(row) }))
    .filter(({ date }) => date)
  const byMonth = new Map()

  rows.forEach(({ date }) => {
    const key = getMonthKey(date)
    byMonth.set(key, (byMonth.get(key) || 0) + 1)
  })

  return byMonth
}

export function getMonthlyUP3Stats(data, up3Id) {
  const monthKeys = new Set(
    data
      .filter((row) => row.up3 === up3Id)
      .map(getPublicationDate)
      .filter(Boolean)
      .map(getMonthKey)
  )

  return Array.from(monthKeys)
    .sort((a, b) => b.localeCompare(a))
    .map((monthKey) => {
      const monthData = data.filter((row) => row.up3 === up3Id && getMonthKey(getPublicationDate(row)) === monthKey)
      const stats = calcUP3Stats(monthData, up3Id)
      const [year, month] = monthKey.split('-').map(Number)

      return {
        monthKey,
        label: new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        ...stats,
      }
    })
}

/**
 * Hitung statistik global dari seluruh data
 */
export function calcGlobalStats(data) {
  const total = data.length
  const lengkap = data.filter((d) => d.status === 'lengkap').length
  const sebagian = data.filter((d) => d.status === 'sebagian').length
  const kosong = data.filter((d) => d.status === 'kosong').length
  const totalLinks = data.reduce((s, d) => s + d.linkCount, 0)
  const maxLinks = total * TOTAL_LINKS
  const pctLinks = maxLinks > 0 ? Math.round((totalLinks / maxLinks) * 100) : 0
  const pctLengkap = total > 0 ? Math.round((lengkap / total) * 100) : 0
  const aktifUP3 = new Set(data.map((d) => d.up3)).size
  const months = new Set(
    data
      .map(getPublicationDate)
      .filter(Boolean)
      .map(getMonthKey)
  ).size
  const publicationTarget = months * MONTHLY_PUBLICATION_TARGET
  const publicationCapaian = publicationTarget > 0 ? Math.round((total / publicationTarget) * 100) : 0

  return { total, lengkap, sebagian, kosong, totalLinks, maxLinks, pctLinks, pctLengkap, aktifUP3, months, publicationTarget, publicationCapaian }
}

/**
 * Hitung quality score global (0-100)
 * Formula: (lengkap / total) * 100, dengan bonus untuk link completion
 */
export function calcGlobalQualityScore(data) {
  if (data.length === 0) return 0
  const stats = calcGlobalStats(data)
  // Quality score = 70% from completion rate + 30% from link completion
  const completionScore = stats.pctLengkap * 0.7
  const linkScore = stats.pctLinks * 0.3
  return Math.round(completionScore + linkScore)
}

/**
 * Hitung quality score per UP3 (0-100)
 */
export function calcUP3QualityScore(data, up3Id) {
  const stats = calcUP3Stats(data, up3Id)
  if (stats.total === 0) return 0
  // Quality score = 70% from completion rate + 30% from link completion
  const completionScore = stats.pctLengkap * 0.7
  const linkScore = stats.pctLinks * 0.3
  return Math.round(completionScore + linkScore)
}

/**
 * Ranking UP3 berdasarkan quality score
 */
export function rankUP3sByQuality(data, up3List) {
  const scores = up3List.map((up3) => ({
    up3,
    score: calcUP3QualityScore(data, up3.id),
  }))
  return scores.sort((a, b) => b.score - a.score)
}
