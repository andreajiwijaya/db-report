import { FileText, Building2, Download, CalendarCheck } from 'lucide-react'

export default function SummaryPanel({ stats = {}, currentMonthStats = {}, totalUnits = 0, currentMonthLabel = 'bulan ini' }) {
  const totalReports = stats.total ?? 0
  const reportingUnits = currentMonthStats.aktifUP3 ?? 0
  const currentMonthReports = currentMonthStats.total ?? 0
  const currentMonthComplete = currentMonthStats.lengkap ?? 0
  const totalLinks = stats.totalLinks ?? 0
  const avgLinks = stats.total > 0 ? (stats.totalLinks / stats.total).toFixed(1) : '0.0'

  const items = [
    { icon: Building2, label: 'Total Unit', value: totalUnits, detail: 'Unit monitoring terdaftar', tone: 'violet' },
    { icon: CalendarCheck, label: 'Unit Melapor', value: reportingUnits, detail: `Melapor pada ${currentMonthLabel}`, tone: 'blue' },
    { icon: FileText, label: 'Total Laporan', value: totalReports, detail: 'Jumlah evidence seluruh periode', tone: 'emerald' },
    { icon: FileText, label: 'Laporan Bulan Ini', value: currentMonthReports, detail: `Laporan pada ${currentMonthLabel}`, tone: 'amber' },
    { icon: Download, label: 'Tautan Terisi', value: totalLinks, detail: `${avgLinks} link/evidence`, tone: 'amber' },
    { icon: FileText, label: 'Evidence Lengkap Bulan Ini', value: currentMonthComplete, detail: 'Minimal 6 dari 10 link terisi', tone: 'emerald' },
  ]
  const itemColumns = [
    items.slice(0, 2),
    items.slice(2, 4),
    items.slice(4, 6),
  ]

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-blue-800 px-5 py-6 sm:px-7">
        <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.15)]" />
              Live monitoring
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Ringkasan Global</h3>
            <p className="mt-1 max-w-xl text-sm text-blue-100/75">Satu pandangan metrik utama berdasarkan kelengkapan 10 link per evidence.</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {itemColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-3">
          {column.map((it) => {
          const Icon = it.icon
          const tone = {
            blue: 'bg-blue-50 text-blue-600 border-blue-100',
            violet: 'bg-violet-50 text-violet-600 border-violet-100',
            amber: 'bg-amber-50 text-amber-600 border-amber-100',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          }[it.tone]

          return (
            <div key={it.label} className="group rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">{it.label}</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{it.value}</p>
                </div>
                <div className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tone}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">{it.detail}</p>
            </div>
          )
          })}
          </div>
        ))}
        </div>

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Kelengkapan Link Evidence</h4>
              <p className="mt-0.5 text-xs text-slate-500">Status lengkap jika minimal 6 dari 10 link pada evidence terisi.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">{totalReports} evidence</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { key: 'lengkap', label: 'Minimal 6 link terisi', value: stats.lengkap ?? 0, color: 'bg-emerald-500', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
              { key: 'sebagian', label: '1–5 link terisi', value: stats.sebagian ?? 0, color: 'bg-amber-400', tone: 'bg-amber-50 text-amber-700 border-amber-100' },
              { key: 'kosong', label: '0 link terisi', value: stats.kosong ?? 0, color: 'bg-slate-400', tone: 'bg-slate-100 text-slate-600 border-slate-200' },
            ].map((item) => {
              const percentage = totalReports > 0 ? Math.round((item.value / totalReports) * 100) : 0
              return (
                <div key={item.key} className={`rounded-2xl border p-3.5 ${item.tone}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold">{item.label}</span>
                    <span className="text-sm font-bold">{item.value}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/80">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="mt-2 text-[11px] opacity-75">{percentage}% dari total evidence</p>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Catatan: status lengkap berarti minimal 6 dari seluruh 10 kolom link terisi. Posisi link tidak menjadi pembeda.
          </p>
        </div>
      </div>
    </section>
  )
}
