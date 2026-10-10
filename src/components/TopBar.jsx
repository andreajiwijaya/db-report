import { useMemo, useState } from 'react'
import { Search, Bell, Download, FileJson, FileText, AlertTriangle, Info, CheckCircle2, CalendarDays, X } from 'lucide-react'
import plnLogo from '../assets/LOGO PLN UID RIAU KEPRI.png'
import { exportToPDF } from '../utils/exportUtils'
import { UP3_LIST } from '../utils/constants'
import { calcGlobalQualityScore, calcGlobalStats, rankUP3sByQuality } from '../utils/dataUtils'

export default function TopBar({ title, subtitle, data = [], rawData = [], activeMenu = 'dashboard', searchValue = '', onSearchChange = () => {} }) {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const isCalendarMode = activeMenu === 'calendar'

  const stats = useMemo(() => calcGlobalStats(data), [data])
  const qualityScore = useMemo(() => calcGlobalQualityScore(data), [data])

  const notifications = useMemo(() => {
    if (rawData.length === 0) {
      return [
        {
          id: 'empty',
          title: 'Belum ada data masuk',
          message: 'Sumber Google Sheets belum mengirim evidence untuk dipantau.',
          icon: AlertTriangle,
          tone: 'warning',
        },
      ]
    }

    const items = [
      {
        id: 'view',
        title: 'Tampilan siap diekspor',
        message: `${data.length} evidence sedang tampil pada menu ${activeMenu}.`,
        icon: Info,
        tone: 'info',
      },
    ]

    if (stats.kosong > 0) {
      items.push({
        id: 'empty-link',
        title: 'Perlu tindak lanjut',
        message: `${stats.kosong} evidence belum upload link dan butuh pengecekan.`,
        icon: AlertTriangle,
        tone: 'warning',
      })
    }

    items.push({
      id: 'quality',
      title: qualityScore >= 80 ? 'Quality tinggi' : qualityScore >= 60 ? 'Quality stabil' : 'Quality perlu perhatian',
      message:
        qualityScore >= 80
          ? `Skor kualitas ${qualityScore}/100 sudah masuk kategori baik.`
          : qualityScore >= 60
            ? `Skor kualitas ${qualityScore}/100 masih aman dipantau.`
            : `Skor kualitas ${qualityScore}/100. Cek unit dengan skor terendah.`,
      icon: CheckCircle2,
      tone: qualityScore >= 80 ? 'success' : qualityScore >= 60 ? 'info' : 'danger',
    })

    const latestEntry = [...data].filter((item) => item.tanggal).sort((a, b) => b.tanggal - a.tanggal)[0]
    if (latestEntry) {
      items.push({
        id: 'latest',
        title: 'Data terbaru terdeteksi',
        message: `${latestEntry.up3Raw || latestEntry.up3 || '-'} · ${latestEntry.judul || 'Tanpa judul'}`,
        icon: Bell,
        tone: 'info',
      })
    }

    return items.slice(0, 4)
  }, [activeMenu, data, qualityScore, rawData.length, stats.kosong])

  const downloadCSV = (dataset, filename) => {
    if (dataset.length === 0) {
      alert('Tidak ada data untuk diexport')
      return
    }

    const headers = ['No', 'Unit', 'Tipe Siaran', 'Judul Evidence', 'Tanggal', ...Array.from({ length: 10 }, (_, i) => `Link ${i + 1}`), 'Status']
    const rows = dataset.map((item, idx) => [
      idx + 1,
      item.up3Raw || item.up3 || '-',
      item.tipe || '-',
      item.judul || '-',
      item.tanggalRaw || '-',
      ...(item.links || []).map((link) => link || '-'),
      item.status || '-',
    ])

    const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setExportOpen(false)
  }

  const handleExportPDF = (dataset, scopeLabel) => {
    if (dataset.length === 0) {
      alert('Tidak ada data untuk diexport')
      return
    }

    const escapeHtml = (value) => String(value ?? '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    const statsPdf = calcGlobalStats(dataset)
    const qualityScorePdf = calcGlobalQualityScore(dataset)
    const qualityRanking = rankUP3sByQuality(dataset, UP3_LIST)

    const summaryCards = `
      <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:20px;">
        <div style="border:1px solid #dbeafe;border-radius:14px;padding:14px;background:#eff6ff;"><div style="font-size:11px;color:#2563eb;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Total Evidence</div><div style="font-size:24px;font-weight:800;color:#0f172a;margin-top:6px;">${statsPdf.total}</div></div>
        <div style="border:1px solid #dbeafe;border-radius:14px;padding:14px;background:#eff6ff;"><div style="font-size:11px;color:#2563eb;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Sudah Lengkap</div><div style="font-size:24px;font-weight:800;color:#0f172a;margin-top:6px;">${statsPdf.lengkap}</div></div>
        <div style="border:1px solid #fef3c7;border-radius:14px;padding:14px;background:#fffbeb;"><div style="font-size:11px;color:#b45309;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Quality Score</div><div style="font-size:24px;font-weight:800;color:#0f172a;margin-top:6px;">${qualityScorePdf}/100</div></div>
        <div style="border:1px solid #e2e8f0;border-radius:14px;padding:14px;background:#f8fafc;"><div style="font-size:11px;color:#475569;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Unit Aktif</div><div style="font-size:24px;font-weight:800;color:#0f172a;margin-top:6px;">${statsPdf.aktifUP3}</div></div>
      </div>
    `

    const rankingRows = qualityRanking.map((item, idx) => `
      <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${idx + 1}</td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(item.up3.label)}</td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(item.up3.area)}</td><td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;">${item.score}</td></tr>
    `).join('')

    const detailRows = dataset.map((item, idx) => `
      <tr><td>${idx + 1}</td><td>${escapeHtml(item.up3Raw || item.up3 || '-')}</td><td>${escapeHtml(item.tipe || '-')}</td><td>${escapeHtml(item.judul || '-')}</td><td>${escapeHtml(item.tanggalRaw || '-')}</td><td>${item.links?.filter((l) => l).length || 0}/10</td><td>${escapeHtml(item.status || '-')}</td></tr>
    `).join('')

    const html = `
      ${summaryCards}
      <div style="margin-bottom:20px;">
        <h3 style="color:#1e40af;margin-bottom:10px;">Peringkat Quality Unit</h3>
        <table><thead><tr><th style="text-align:left;">#</th><th style="text-align:left;">Unit</th><th style="text-align:left;">Area</th><th style="text-align:right;">Score</th></tr></thead><tbody>${rankingRows}</tbody></table>
      </div>
      <div>
        <h3 style="color:#1e40af;margin-bottom:10px;">Detail Evidence</h3>
        <table><thead><tr><th>No</th><th>Unit</th><th>Tipe Siaran</th><th>Judul Evidence</th><th>Tanggal</th><th>Links</th><th>Status</th></tr></thead><tbody>${detailRows}</tbody></table>
      </div>
    `

    exportToPDF('MonEv Evidence Report', html, {
      logoSrc: plnLogo,
      subtitle: 'PLN UID Riau & Kepri - Monitoring Evidence Report',
      scopeLabel,
    })
    setExportOpen(false)
  }

  return (
    <div className={`${isCalendarMode ? 'bg-linear-to-r from-blue-50 via-white to-slate-50' : 'bg-white/92'} relative z-40 overflow-visible backdrop-blur-sm border-b border-slate-200/50 px-4 sm:px-6 py-3 sm:py-4 shadow-[0_1px_0_rgba(15,23,42,0.015)]`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-[1.35rem] font-bold tracking-tight text-slate-900">{title}</h1>
            {isCalendarMode && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                <CalendarDays size={12} />
                Calendar
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
          {!isCalendarMode && (
            <div className="hidden xl:flex relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari evidence..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-slate-200/80 rounded-full text-sm bg-slate-50/80 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white min-w-72"
              />
            </div>
          )}

          {!isCalendarMode && (
            <div className="relative">
              <button
                onClick={() => {
                  setExportOpen(false)
                  setNotificationOpen((open) => !open)
                }}
                className="relative p-2.5 hover:bg-blue-50 rounded-full transition-colors border border-transparent hover:border-blue-100"
                aria-label="Buka notifikasi sistem"
              >
                <Bell size={18} className="text-blue-700" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-100 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Notifikasi Sistem</p>
                      <p className="text-xs text-slate-500">Ringkasan status dashboard</p>
                    </div>
                    <button onClick={() => setNotificationOpen(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-white">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="max-h-80 space-y-2 overflow-y-auto p-3">
                    {notifications.map((item) => {
                      const Icon = item.icon
                      const toneClass =
                        item.tone === 'success'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : item.tone === 'warning'
                            ? 'bg-yellow-50 text-yellow-800 border-yellow-100'
                            : item.tone === 'danger'
                              ? 'bg-red-50 text-red-700 border-red-100'
                              : 'bg-blue-50 text-blue-700 border-blue-100'

                      return (
                        <div key={item.id} className={`rounded-2xl border p-3 ${toneClass}`}>
                          <div className="flex items-start gap-3">
                            <Icon size={16} className="mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold leading-tight">{item.title}</p>
                              <p className="mt-1 text-xs leading-relaxed opacity-80">{item.message}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>          )}

          {!isCalendarMode && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationOpen(false)
                  setExportOpen((open) => !open)
                }}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50"
              >
                <Download size={16} className="text-blue-700" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {exportOpen && (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-100 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">Export Data</p>
                    <p className="text-xs text-slate-500">Pilih data tampil atau semua data</p>
                  </div>
                  <div className="space-y-3 p-3">
                    <div>
                      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Data Tampil</p>
                      <button onClick={() => downloadCSV(data, `evidence-terfilter-${new Date().toISOString().split('T')[0]}.csv`)} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700">
                        <FileJson size={14} />
                        Export CSV
                      </button>
                      <button onClick={() => handleExportPDF(data, 'terfilter')} className="mt-1 flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700">
                        <FileText size={14} />
                        Export PDF
                      </button>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Semua Data</p>
                      <button onClick={() => downloadCSV(rawData, `evidence-semua-data-${new Date().toISOString().split('T')[0]}.csv`)} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700">
                        <FileJson size={14} />
                        Export CSV
                      </button>
                      <button onClick={() => handleExportPDF(rawData, 'semua-data')} className="mt-1 flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700">
                        <FileText size={14} />
                        Export PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 ml-1 pl-3 border-l border-slate-200/80">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              A
            </div>
            <div className="hidden sm:block text-sm">
              <p className="font-medium text-slate-900 leading-tight">Komunikasi</p>
              <p className="text-xs text-slate-500 leading-tight mt-0.5">Pengelola Monitoring Evidence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
