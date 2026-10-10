import { useMemo, useState } from 'react'
import { AlertTriangle, CalendarDays, ClipboardList } from 'lucide-react'

import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import FilterBar from '../components/FilterBar'
import EvidenceTable from '../components/EvidenceTable'
import ActivityFeed from '../components/ActivityFeed'
import UP3DetailView from '../components/UP3DetailView'
import UP3Card from '../components/UP3Card'
import CalendarView from '../components/CalendarView'
import SummaryPanel from '../components/SummaryPanel'
import UP3CompletionTable from '../components/UP3CompletionTable'
import UP3ProgressChart from '../components/UP3ProgressChart'
import LoadingSkeleton from '../components/LoadingSkeleton'
import PageHero from '../components/PageHero'

import { useMonevData, useFilteredData } from '../hooks/useMonevData'
import { calcGlobalStats, getLatestMonthKey, getMonthKey, getPublicationDate } from '../utils/dataUtils'
import { UP3_LIST } from '../utils/constants'

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [filters, setFilters] = useState({ up3: 'all', bulan: 'all', tipe: 'all', status: 'all', search: '', dateFrom: undefined, dateTo: undefined })
  const [activeUP3, setActiveUP3] = useState(null)

  const { rawData, loading, error, refetch } = useMonevData()
  const filteredData = useFilteredData(rawData, filters)
  const latestMonthKey = useMemo(() => getLatestMonthKey(rawData), [rawData])
  const currentMonthData = useMemo(
    () => latestMonthKey
      ? rawData.filter((item) => getMonthKey(getPublicationDate(item)) === latestMonthKey)
      : [],
    [rawData, latestMonthKey]
  )
  const currentMonthLabel = useMemo(() => {
    const currentMonth = currentMonthData.map(getPublicationDate).find(Boolean)
    return currentMonth
      ? currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      : 'berjalan'
  }, [currentMonthData])
  const tipeOptions = useMemo(() => [...new Set(rawData.map((item) => item.tipe).filter(Boolean))].sort(), [rawData])

  const globalStats = useMemo(() => calcGlobalStats(filteredData), [filteredData])
  const currentMonthStats = useMemo(() => calcGlobalStats(currentMonthData), [currentMonthData])
  const latestTanggal = useMemo(() => {
    const sorted = filteredData
      .map((item) => getPublicationDate(item))
      .filter(Boolean)
      .sort((a, b) => b - a)
    return sorted[0] ?? null
  }, [filteredData])

  const oldestTanggal = useMemo(() => {
    const sorted = filteredData
      .map((item) => getPublicationDate(item))
      .filter(Boolean)
      .sort((a, b) => a - b)
    return sorted[0] ?? null
  }, [filteredData])

  const monthSummary = useMemo(() => {
    const map = new Map()

    filteredData.forEach((item) => {
      const date = getPublicationDate(item)
      if (!date) return
      const key = getMonthKey(date)
      const label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

      if (!map.has(key)) {
        map.set(key, { key, label, count: 0 })
      }

      map.get(key).count += 1
    })

    return Array.from(map.values())
  }, [filteredData])

  const handleUP3Click = (up3Id) => {
    setActiveUP3(up3Id)
    setFilters((current) => ({ ...current, up3: up3Id }))
  }

  if (loading && rawData.length === 0) {
    return <LoadingSkeleton />
  }

  if (error && rawData.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md w-full mx-4 bg-white border border-slate-200 rounded-lg p-8 text-center">
          <AlertTriangle size={36} className="text-yellow-500 mx-auto mb-3" />
          <p className="font-semibold text-slate-700 mb-1">Gagal memuat data</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const contentTitle = {
    dashboard: 'Dashboard Monitoring',
    'unit-performance': 'Performa Unit',
    evidence: 'Evidence Detail',
    activity: 'Activity Log',
    calendar: 'Calendar',
  }[activeMenu] ?? 'Dashboard Monitoring'

  const contentSubtitle = {
    dashboard: 'Ringkasan cepat status evidence seluruh unit',
    'unit-performance': 'Analitik kelengkapan dan status evidence per unit',
    evidence: 'Daftar evidence lengkap dengan filter dan status',
    activity: 'Aktivitas terbaru evidence dan item yang perlu follow-up',
    calendar: 'Tampilan kalender untuk melihat sebaran evidence per tanggal',
  }[activeMenu] ?? 'Ringkasan evidence'

  return (
    <div className="flex min-h-dvh bg-transparent">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} data={filteredData} rawData={rawData} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <TopBar
          title={contentTitle}
          subtitle={contentSubtitle}
          data={filteredData}
          rawData={rawData}
          activeMenu={activeMenu}
          searchValue={filters.search}
          onSearchChange={(value) => setFilters((current) => ({ ...current, search: value }))}
        />

        <main className="relative flex-1 overflow-auto">
          {loading && rawData.length > 0 && (
            <div className="pointer-events-none absolute inset-0 z-30 bg-white/45 backdrop-blur-[1px]">
              <div className="sticky top-4 mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold text-blue-700 shadow-lg">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                Memperbarui data...
              </div>
            </div>
          )}
          <div className="mx-auto w-full max-w-450 space-y-6 p-4 pb-24 sm:p-6 sm:pb-24 xl:p-8 xl:pb-10">
            {(activeMenu === 'dashboard' || activeMenu === 'unit-performance') && activeUP3 ? (
              <UP3DetailView
                up3Id={activeUP3}
                data={currentMonthData}
                historicalData={rawData}
                currentMonthLabel={currentMonthLabel}
                onBack={() => {
                  setActiveUP3(null)
                  setFilters((current) => ({ ...current, up3: 'all' }))
                }}
              />
            ) : activeMenu === 'dashboard' ? (
              <>
                <SummaryPanel
                  stats={globalStats}
                  currentMonthStats={currentMonthStats}
                  totalUnits={UP3_LIST.length}
                  currentMonthLabel={currentMonthLabel}
                />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <UP3ProgressChart rawData={rawData} />
                  <UP3CompletionTable data={currentMonthData} monthLabel={currentMonthLabel} monthKey={latestMonthKey} />
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                  <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Ringkasan Cepat</h3>
                      <p className="text-sm text-slate-500">Snapshot kondisi evidence paling penting untuk pembukaan dashboard.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        <CalendarDays size={14} />
                        {latestTanggal ? latestTanggal.toLocaleDateString('id-ID') : 'Belum ada tanggal'}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-100">
                        <ClipboardList size={14} />
                        {globalStats.total} evidence
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {monthSummary.map((item) => (
                      <div key={item.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{item.count}</p>
                        <p className="text-xs text-slate-500 mt-1">evidence diisi pada bulan tersebut</p>
                      </div>
                    ))}
                  </div>
                </div>

              </>
            ) : activeMenu === 'unit-performance' ? (
              activeUP3 ? (
                <UP3DetailView
                  up3Id={activeUP3}
                  data={currentMonthData}
                  historicalData={rawData}
                  currentMonthLabel={currentMonthLabel}
                  onBack={() => {
                    setActiveUP3(null)
                    setFilters((current) => ({ ...current, up3: 'all' }))
                  }}
                />
              ) : (
                <div className="space-y-5">
                  <PageHero
                    eyebrow="Analitik unit"
                    title="Performa Unit"
                    description="Bandingkan capaian publikasi dan status evidence setiap unit dalam satu tampilan."
                  >
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left backdrop-blur-sm lg:text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-100/65">Unit terdaftar</p>
                      <p className="mt-1 text-lg font-bold text-white">{UP3_LIST.length}</p>
                      <p className="text-xs text-blue-100/70">unit monitoring</p>
                    </div>
                  </PageHero>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {UP3_LIST.map((up3) => (
                      <UP3Card
                        key={up3.id}
                        up3={up3}
                        data={rawData}
                        monthKey={latestMonthKey}
                        isActive={false}
                        onClick={() => handleUP3Click(up3.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            ) : activeMenu === 'evidence' ? (
              <>
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                  <PageHero eyebrow="Arsip monitoring" title="Evidence" description="Cari, saring, dan periksa tautan evidence dalam satu tempat.">
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left backdrop-blur-sm lg:text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-100/65">Data tersaring</p>
                      <p className="mt-1 text-lg font-bold text-white">{filteredData.length}</p>
                      <p className="text-xs text-blue-100/70">evidence</p>
                    </div>
                  </PageHero>
                  <div className="p-4 sm:p-6">
                  <FilterBar filters={filters} onChange={setFilters} tipeOptions={tipeOptions} />
                  </div>
                </div>

                <EvidenceTable data={filteredData} />
              </>
            ) : activeMenu === 'activity' ? (
              <ActivityFeed data={filteredData} latestTanggal={latestTanggal} oldestTanggal={oldestTanggal} />
            ) : activeMenu === 'calendar' ? (
              <CalendarView key={filteredData.map((item) => item.id).join('-')} data={filteredData} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
