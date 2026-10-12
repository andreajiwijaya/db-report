import { AlertTriangle, ArrowUpRight, CalendarRange, CheckCircle2, Clock3, Link2, ListChecks } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatTanggal, formatTimestamp, getPublicationDate } from '../utils/dataUtils'
import { MONTHLY_PUBLICATION_TARGET } from '../utils/constants'
import { getStatusLabel } from '../utils/constants'

export default function ActivityFeed({ data = [] }) {
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const recentItems = [...data]
    .filter((item) => item.timestampDate || item.tanggal)
    .sort((a, b) => {
      const dateA = getPublicationDate(a)
      const dateB = getPublicationDate(b)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 8)

  const incompleteCount = data.filter((item) => item.status !== 'lengkap').length
  const completeCount = data.filter((item) => item.status === 'lengkap').length
  const publicationMonths = new Set(
    data
      .map(getPublicationDate)
      .filter(Boolean)
      .map((date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  ).size
  const publicationTarget = publicationMonths * MONTHLY_PUBLICATION_TARGET
  const publicationCapaian = publicationTarget > 0 ? Math.round((data.length / publicationTarget) * 100) : 0
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="relative overflow-hidden border-b border-slate-200/80 bg-linear-to-br from-slate-950 via-blue-950 to-blue-800 px-5 py-6 sm:px-7">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100 backdrop-blur-sm">
              <ListChecks size={12} />
              Monitoring aktivitas
            </div>
            <h3 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">Siaran Pers terbaru</h3>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-blue-100/75">Pantau Siaran Pers yang baru masuk berdasarkan waktu pengisian GForm dan prioritaskan item yang masih perlu dilengkapi.</p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-100">
              <CalendarRange size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-100/60">Waktu monitoring</p>
              <p
                className="mt-1 text-sm font-semibold text-white"
                title="Tanggal dan waktu perangkat saat ini"
                aria-live="polite"
              >
                {currentDateTime.toLocaleString('id-ID', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-slate-50/55 p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total aktivitas', value: data.length, detail: 'Siaran Pers tercatat', tone: 'blue' },
            { label: 'Perlu tindak lanjut', value: incompleteCount, detail: 'belum lengkap', tone: 'amber' },
            { label: 'Sudah lengkap', value: completeCount, detail: 'siap direkap', tone: 'emerald' },
            { label: 'Capaian Siaran Pers', value: `${publicationCapaian}%`, detail: `${data.length}/${publicationTarget} Siaran Pers`, tone: 'violet' },
          ].map((item) => {
            const tone = {
              blue: 'border-blue-100 bg-blue-50/70 text-blue-700',
              amber: 'border-amber-100 bg-amber-50/70 text-amber-700',
              emerald: 'border-emerald-100 bg-emerald-50/70 text-emerald-700',
              violet: 'border-violet-100 bg-violet-50/70 text-violet-700',
            }[item.tone]

            return (
              <div key={item.label} className={`rounded-2xl border px-3.5 py-3 ${tone}`}>
                <p className="text-[11px] font-semibold">{item.label}</p>
                <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">{item.value}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{item.detail}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-slate-900">Aktivitas terbaru</h4>
            <p className="mt-0.5 text-xs text-slate-500">Diurutkan dari Siaran Pers yang paling baru diterima.</p>
          </div>
          <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
            {recentItems.length} terbaru
          </span>
        </div>

        <div className="space-y-3">
        {recentItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <Clock3 className="mx-auto text-slate-300" size={28} />
            <p className="mt-3 text-sm font-medium text-slate-700">Belum ada aktivitas yang bisa ditampilkan</p>
            <p className="mt-1 text-xs text-slate-500">Activity log akan muncul setelah Siaran Pers masuk ke sistem.</p>
          </div>
        ) : (
          recentItems.map((item) => {
            const isComplete = item.status === 'lengkap'
            const isPartial = item.status === 'sebagian'
            const statusClass = isComplete
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : isPartial
                ? 'bg-yellow-50 text-yellow-800 border-yellow-100'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            const Icon = isComplete ? CheckCircle2 : isPartial ? AlertTriangle : Link2
            const detailText = isComplete
              ? 'Siaran Pers siap direkap dan dipakai untuk laporan.'
              : isPartial
                ? `${item.linkCount}/10 link terisi. Minimal 6 link diperlukan.`
                : 'Belum ada link Siaran Pers yang masuk.'

            return (
              <div key={item.id} className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:bg-blue-50/35 hover:shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${statusClass}`}>
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">{item.judul || 'Tanpa judul'}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.up3Raw || item.up3 || '-'} · {item.tipe || 'Tipe tidak tersedia'}
                        </p>
                        <div className="mt-2 space-y-1 text-xs">
                          <p className="text-blue-700">
                            <span className="font-semibold">Diisi Google Form:</span> {formatTimestamp(item.timestampDate || item.timestamp)}
                          </p>
                          <p className="text-slate-500">
                            <span className="font-semibold">Periode siaran pers:</span> {formatTanggal(item.tanggal)}
                          </p>
                        </div>
                      </div>

                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusClass}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs leading-relaxed text-slate-600">{detailText}</p>
                      {item.links?.find(Boolean) && (
                        <a href={item.links.find(Boolean)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 hover:text-blue-900">
                          Buka tautan <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        </div>
      </div>
    </section>
  )
}
