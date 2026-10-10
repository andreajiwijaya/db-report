import { useState } from 'react'
import { ChevronLeft, FileText, CheckCircle, AlertTriangle, BarChart3, ListChecks } from 'lucide-react'
import { calcUP3Stats, getMonthKey, getMonthlyUP3Stats } from '../utils/dataUtils'
import { UP3_LIST } from '../utils/constants'
import StatCard from './StatCard'
import UP3StatusChart from './UP3StatusChart'
import EvidenceTable from './EvidenceTable'

export default function UP3DetailView({ up3Id, data, historicalData = data, currentMonthLabel, onBack }) {
  const [activeTab, setActiveTab] = useState('overview')
  const unit = UP3_LIST.find((item) => item.id === up3Id)
  if (!unit) return null

  const sourceData = historicalData?.length ? historicalData : data
  const stats = calcUP3Stats(data, up3Id)
  const unitData = data.filter((item) => item.up3 === up3Id)
  const allUnitData = sourceData.filter((item) => item.up3 === up3Id)
  const monthlyStats = getMonthlyUP3Stats(sourceData, up3Id)
  const evidenceByMonth = Array.from(
    allUnitData.reduce((groups, item) => {
      const monthDate = [item.timestampDate, item.tanggal]
        .find((date) => date instanceof Date && !isNaN(date.getTime())) || null
      const monthKey = getMonthKey(monthDate) || 'tanpa-periode'
      if (!groups.has(monthKey)) {
        groups.set(monthKey, {
          monthKey,
          label: monthDate
            ? monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
            : 'Tanpa periode',
          items: [],
        })
      }
      groups.get(monthKey).items.push(item)
      return groups
    }, new Map()).values()
  )
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
    .map((group) => ({
      ...group,
      items: group.items.sort((a, b) => {
        const dateA = [a.timestampDate, a.tanggal]
          .find((date) => date instanceof Date && !isNaN(date.getTime()))
        const dateB = [b.timestampDate, b.tanggal]
          .find((date) => date instanceof Date && !isNaN(date.getTime()))
        return (dateB ? dateB.getTime() : 0) - (dateA ? dateA.getTime() : 0)
      }),
    }))

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-blue-700 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <button
            onClick={onBack}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-blue-50 transition hover:bg-white/20"
          >
            <ChevronLeft size={16} />
            Kembali ke Dashboard
          </button>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Detail unit</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{unit.label}</h2>
              <p className="mt-2 text-sm text-blue-100">{unit.area} · Monitoring evidence & analytics</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs text-blue-100">Evidence {currentMonthLabel ? `bulan ${currentMonthLabel}` : 'bulan berjalan'}</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-3 z-10 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-sm backdrop-blur">
        {[
          { id: 'overview', label: 'Ringkasan', icon: BarChart3 },
          { id: 'evidence', label: 'Daftar Evidence', icon: ListChecks },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FileText} label="Total Evidence" value={stats.total} trend={false} />
            <StatCard icon={CheckCircle} label="Sudah Lengkap" value={stats.lengkap} trend={false} />
            <StatCard icon={AlertTriangle} label="Sebagian Link" value={stats.sebagian} trend={false} />
            <StatCard icon={BarChart3} label="Capaian Publikasi" value={`${stats.publicationCapaian}%`} trend={false} />
          </div>

          <UP3StatusChart data={unitData} up3={unit} />

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Tren bulanan</p>
              <h3 className="text-lg font-bold text-slate-900">Performa per bulan</h3>
              <p className="mt-1 text-sm text-slate-500">Perbandingan statistik bulan terbaru dengan bulan-bulan sebelumnya.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {monthlyStats.map((month) => (
                <div key={month.monthKey} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="font-semibold capitalize text-slate-800">{month.label}</p>
                    {month.monthKey === monthlyStats[0]?.monthKey && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700">Terbaru</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Evidence</p>
                      <p className="font-bold text-slate-900">{month.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Capaian</p>
                      <p className="font-bold text-slate-900">{month.publicationCapaian}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Lengkap</p>
                      <p className="font-bold text-emerald-700">{month.lengkap}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Perlu dilengkapi</p>
                      <p className="font-bold text-amber-700">{month.sebagian}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-green-100 p-5">
              <p className="mb-3 text-sm font-semibold text-emerald-900">Realisasi Publikasi</p>
              <p className="text-3xl font-bold text-emerald-900">{stats.publicationCapaian}%</p>
              <p className="mt-2 text-xs text-emerald-700">
                {stats.total} publikasi dari target {stats.publicationTarget} pada periode data
              </p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-5">
              <p className="mb-3 text-sm font-semibold text-blue-900">Total Link Terisi</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalLinks}</p>
              <p className="mt-2 text-xs text-blue-700">
                Dari maksimal {stats.total * 10} link ({stats.total} evidence × 10 link)
              </p>
            </div>
            <div className="rounded-2xl border border-yellow-200 bg-linear-to-br from-yellow-50 to-yellow-100 p-5">
              <p className="mb-3 text-sm font-semibold text-yellow-900">Rata-rata Link per Evidence</p>
              <p className="text-3xl font-bold text-yellow-900">
                {stats.total > 0 ? (stats.totalLinks / stats.total).toFixed(1) : '0'}
              </p>
              <p className="mt-2 text-xs text-yellow-700">
                Minimal 6 dari 10 link harus terisi agar evidence dianggap lengkap
              </p>
            </div>
          </div>
        </div>
      ) : (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Arsip unit</p>
              <h3 className="text-xl font-bold text-slate-900">Daftar Evidence</h3>
              <p className="mt-1 text-sm text-slate-500">Semua evidence unit ini, dikelompokkan berdasarkan bulan pengisian GForm</p>
            </div>
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {allUnitData.length} evidence
            </span>
          </div>
          <div className="space-y-6">
            {evidenceByMonth.map((group) => (
              <section key={group.monthKey}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-base font-bold capitalize text-slate-900">{group.label}</h4>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {group.items.length} evidence
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <EvidenceTable data={group.items} />
                </div>
              </section>
            ))}
            {evidenceByMonth.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Belum ada evidence untuk unit ini.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
