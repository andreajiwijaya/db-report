import { useMemo, useState } from 'react'
import { Bell, Download, FileJson, FileText, AlertTriangle, Info, CheckCircle2, CalendarDays, X } from 'lucide-react'
import { exportPublicationPDF } from '../utils/exportUtils'
import { MONTHLY_PUBLICATION_TARGET } from '../utils/constants'
import { calcGlobalStats, getMonthKey, getPeriodDate, getPublicationDate } from '../utils/dataUtils'

export default function TopBar({ title, subtitle, data = [], rawData = [], activeMenu = 'dashboard' }) {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const isCalendarMode = activeMenu === 'calendar'

  const stats = useMemo(() => calcGlobalStats(data), [data])
  const notifications = useMemo(() => {
    if (rawData.length === 0) {
      return [
        {
          id: 'empty',
          title: 'Belum ada data masuk',
          message: 'Sumber Google Sheets belum mengirim Siaran Pers untuk dipantau.',
          icon: AlertTriangle,
          tone: 'warning',
        },
      ]
    }

    const items = [
      {
        id: 'view',
        title: 'Data siap dipantau',
        message: `${data.length} Siaran Pers sedang ditampilkan pada halaman ${activeMenu}.`,
        icon: Info,
        tone: 'info',
      },
    ]

    if (stats.kosong > 0) {
      items.push({
        id: 'empty-link',
        title: 'Perlu tindak lanjut',
        message: `${stats.kosong} Siaran Pers belum upload link dan butuh pengecekan.`,
        icon: AlertTriangle,
        tone: 'warning',
      })
    }

    if (stats.sebagian > 0) {
      items.push({
        id: 'partial-link',
        title: 'Siaran Pers belum lengkap',
        message: `${stats.sebagian} Siaran Pers baru memiliki 1–5 link dan perlu dilengkapi.`,
        icon: AlertTriangle,
        tone: 'warning',
      })
    }

    if (stats.sebagian === 0 && stats.kosong === 0) {
      items.push({
        id: 'quality',
        title: 'Siaran Pers lengkap',
        message: `Semua ${stats.total} Siaran Pers yang tampil memiliki minimal 6 link terisi.`,
        icon: CheckCircle2,
        tone: 'success',
      })
    }

    const latestEntry = [...data]
      .filter((item) => getPublicationDate(item))
      .sort((a, b) => getPublicationDate(b) - getPublicationDate(a))[0]
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
  }, [activeMenu, data, rawData.length, stats.kosong, stats.sebagian, stats.total])

  const attentionCount = notifications.filter((item) => item.tone === 'warning' || item.tone === 'danger').length

  const getMonthLabel = (date) => date
    ? date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : 'Tanpa periode'

  const getGroupedPublicationData = (dataset) => {
    const groups = new Map()
    dataset.forEach((item) => {
      const date = getPeriodDate(item)
      const monthKey = getMonthKey(date) || 'tanpa-periode'
      const unitKey = item.up3 || item.up3Raw || 'tanpa-unit'
      const key = `${unitKey}::${monthKey}`
      if (!groups.has(key)) {
        groups.set(key, {
          unitKey,
          unitLabel: item.up3Raw || item.up3 || 'Tanpa unit',
          monthKey,
          monthLabel: getMonthLabel(date),
          items: [],
        })
      }
      groups.get(key).items.push(item)
    })

    return Array.from(groups.values()).sort((a, b) => {
      const unitCompare = a.unitLabel.localeCompare(b.unitLabel)
      return unitCompare || b.monthKey.localeCompare(a.monthKey)
    })
  }

  const downloadPublicationCSV = (dataset, filename) => {
    if (dataset.length === 0) {
      alert('Tidak ada data untuk diexport')
      return
    }

    const groups = getGroupedPublicationData(dataset)
    const csvCell = (value) => `"${String(value ?? '-').replace(/"/g, '""')}"`
    const summaryRows = groups.map((group) => [
      group.unitLabel,
      group.monthLabel,
      group.items.length,
      MONTHLY_PUBLICATION_TARGET,
      Math.round((group.items.length / MONTHLY_PUBLICATION_TARGET) * 100),
    ])
    const detailRows = groups.flatMap((group) => group.items.map((item, index) => [
      group.unitLabel,
      group.monthLabel,
      index + 1,
      item.tanggalRaw || '-',
      item.tipe || '-',
      item.judul || '-',
      item.links?.filter(Boolean).length || 0,
      item.status || '-',
    ]))
    const csvLines = [
      ['REALISASI PUBLIKASI PER UNIT PER BULAN'],
      ['Unit', 'Bulan Periode Siaran', 'Realisasi', 'Target', 'Capaian (%)'],
      ...summaryRows,
      [],
      ['DETAIL PERS PER UNIT PER BULAN'],
      ['Unit', 'Bulan Periode Siaran', 'No', 'Tanggal Periode', 'Tipe Siaran', 'Judul Pers', 'Link Terisi', 'Status'],
      ...detailRows,
    ]
    const csvContent = csvLines.map((row) => row.map(csvCell).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }

  const handleExportPDF = (dataset) => {
    if (dataset.length === 0) {
      alert('Tidak ada data untuk diexport')
      return
    }

    const groups = getGroupedPublicationData(dataset)
    exportPublicationPDF({
      groups,
      target: MONTHLY_PUBLICATION_TARGET,
      filename: `laporan-monitoring-siaran-pers-${new Date().toISOString().split('T')[0]}.pdf`,
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

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:gap-3 lg:w-auto lg:gap-4">
          <div className="static sm:relative">
            <button
                onClick={() => {
                  setExportOpen(false)
                  setNotificationOpen((open) => !open)
                }}
                className={`relative rounded-full border border-transparent p-2.5 transition-colors ${
                  attentionCount > 0
                    ? 'text-red-600 hover:border-red-100 hover:bg-red-50'
                    : 'text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50'
                }`}
                aria-label="Buka notifikasi sistem"
              >
                <Bell size={18} />
                {attentionCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    {attentionCount}
                  </span>
                )}
              </button>

            {notificationOpen && (
                <div className="absolute right-4 top-full z-100 mt-2 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:right-0 sm:top-[calc(100%+0.75rem)] sm:mt-0">
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Notifikasi Sistem</p>
                      <p className="text-xs text-slate-500">{attentionCount ? `${attentionCount} hal perlu perhatian` : 'Tidak ada hal mendesak'}</p>
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
          </div>

          <div className="static sm:relative">
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
                <div className="absolute right-4 top-full z-100 mt-2 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:right-0 sm:top-[calc(100%+0.75rem)] sm:mt-0">
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">Export Data</p>
                    <p className="text-xs text-slate-500">Unduh realisasi dan detail pers dari data yang sedang tampil.</p>
                  </div>
                  <div className="space-y-3 p-3">
                    <button onClick={() => downloadPublicationCSV(data, `realisasi-pers-${new Date().toISOString().split('T')[0]}.csv`)} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700">
                      <FileJson size={14} />
                      CSV — realisasi & detail {data.length} pers
                    </button>
                    <button onClick={() => handleExportPDF(data)} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700">
                      <FileText size={14} />
                      PDF — laporan {data.length} pers
                    </button>
                  </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 ml-1 pl-3 border-l border-slate-200/80">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              K
            </div>
            <div className="hidden sm:block text-sm">
              <p className="font-medium text-slate-900 leading-tight">Komunikasi</p>
              <p className="text-xs text-slate-500 leading-tight mt-0.5">Pengelola Monitoring SiPers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}