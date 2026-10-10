import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { formatTanggal, formatTimestamp } from '../utils/dataUtils'
import { getStatusLabel, STATUS_COLOR } from '../utils/constants'
import PageHero from './PageHero'

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export default function CalendarView({ data = [] }) {
  const firstDataDate = useMemo(
    () => data.filter((item) => item.timestampDate).sort((a, b) => a.timestampDate - b.timestampDate)[0]?.timestampDate,
    [data]
  )
  const latestDataDate = useMemo(
    () => data.filter((item) => item.timestampDate).sort((a, b) => b.timestampDate - a.timestampDate)[0]?.timestampDate,
    [data]
  )
  const [cursor, setCursor] = useState(() => startOfMonth(latestDataDate || new Date()))
  const [selectedDate, setSelectedDate] = useState(() => latestDataDate ? dateKey(latestDataDate) : null)

  const eventsByDate = useMemo(() => {
    const map = new Map()
    data.forEach((item) => {
      if (!item.timestampDate) return
      const key = dateKey(item.timestampDate)
      map.set(key, [...(map.get(key) || []), item])
    })
    return map
  }, [data])

  const monthStart = startOfMonth(cursor)
  const totalDays = daysInMonth(cursor)
  const startWeekday = (monthStart.getDay() + 6) % 7
  const cells = Array.from({ length: startWeekday + totalDays }, (_, index) => (
    index < startWeekday ? null : new Date(cursor.getFullYear(), cursor.getMonth(), index - startWeekday + 1)
  ))
  const selectedEvents = selectedDate ? eventsByDate.get(selectedDate) || [] : []

  const moveMonth = (offset) => {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
    setSelectedDate(null)
  }

  const jumpToLatest = () => {
    const target = latestDataDate || new Date()
    setCursor(startOfMonth(target))
    setSelectedDate(latestDataDate ? dateKey(latestDataDate) : null)
  }

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Arsip waktu" title="Kalender Pengisian GForm" description={`${data.length} siaran diunggah pada ${eventsByDate.size} tanggal pengisian. Pilih tanggal untuk melihat detail.`}>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={jumpToLatest} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20">Data terbaru</button>
          <button onClick={() => moveMonth(-1)} aria-label="Bulan sebelumnya" className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"><ChevronLeft size={16} /></button>
          <p className="min-w-32 text-center text-sm font-bold capitalize text-white">
            {cursor.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </p>
          <button onClick={() => moveMonth(1)} aria-label="Bulan berikutnya" className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"><ChevronRight size={16} /></button>
        </div>
      </PageHero>

      {data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">Belum ada evidence untuk ditampilkan pada kalender.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:mb-3 sm:gap-2 sm:text-xs">
              {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {cells.map((cell, index) => {
                if (!cell) return <div key={`empty-${index}`} className="min-h-14 rounded-lg bg-slate-50/80 sm:min-h-24 sm:rounded-xl" />
                const key = dateKey(cell)
                const events = eventsByDate.get(key) || []
                const isSelected = selectedDate === key
                return (
                  <button key={key} onClick={() => setSelectedDate(key)} className={`min-h-14 rounded-lg border p-1 text-left transition-colors sm:min-h-24 sm:rounded-xl sm:p-2 ${isSelected ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/40'}`}>
                    <span className={`text-xs font-semibold sm:text-sm ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{cell.getDate()}</span>
                    {events.length > 0 && (
                      <span className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-blue-700 sm:mt-3 sm:gap-1.5 sm:text-xs">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />{events.length} siaran diunggah
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" />Ada pengisian GForm</span>
              <span>{firstDataDate ? `Data mulai ${formatTanggal(firstDataDate)}` : ''}</span>
              <span>{latestDataDate ? `Terakhir ${formatTanggal(latestDataDate)}` : ''}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">{selectedEvents.length ? formatTanggal(selectedEvents[0].timestampDate) : 'Pilih tanggal'}</h3>
            <p className="mt-1 text-sm text-slate-500">{selectedEvents.length ? `${selectedEvents.length} siaran diunggah pada tanggal ini` : 'Klik tanggal bertanda titik biru untuk melihat pengisian GForm.'}</p>
            <div className="mt-4 space-y-3">
              {selectedEvents.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-snug text-slate-800">{item.judul || 'Tanpa judul'}</p>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${STATUS_COLOR[item.status].bg} ${STATUS_COLOR[item.status].text}`}>{getStatusLabel(item.status)}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{item.up3Raw || item.up3 || '-'} · {item.tipe || 'Tipe tidak tersedia'}</p>
                  <p className="mt-1 text-xs text-blue-700"><span className="font-semibold">Diisi GForm:</span> {formatTimestamp(item.timestamp)}</p>
                  <p className="mt-1 text-xs text-slate-500"><span className="font-semibold">Periode siaran:</span> {formatTanggal(item.tanggal)}</p>
                  {item.links?.find(Boolean) && <a href={item.links.find(Boolean)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">Buka evidence <ExternalLink size={12} /></a>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
