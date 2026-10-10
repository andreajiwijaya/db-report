import { Search, X, Calendar, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { UP3_LIST } from '../utils/constants'
import { useState } from 'react'

export default function FilterBar({ filters, onChange, tipeOptions = [] }) {
  const [showDateRange, setShowDateRange] = useState(false)

  const set = (key, value) => onChange({ ...filters, [key]: value })

  const hasActiveFilter =
    filters.up3 !== 'all' ||
    filters.bulan !== 'all' ||
    filters.tipe !== 'all' ||
    filters.status !== 'all' ||
    filters.search !== '' ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined

  const reset = () =>
    onChange({ up3: 'all', bulan: 'all', tipe: 'all', status: 'all', search: '', dateFrom: undefined, dateTo: undefined })

  const formatDateForInput = (date) => {
    if (!date) return ''
    return date instanceof Date ? date.toISOString().split('T')[0] : date
  }

  const formatDateDisplay = (date) => {
    if (!date) return ''
    try {
      const d = new Date(date)
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return ''
    }
  }

  const activeDateRange = filters.dateFrom || filters.dateTo

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="group relative w-full lg:min-w-64 lg:flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
          <input
            type="text"
            placeholder="Cari judul, unit, atau tipe..."
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          {filters.search && (
            <button
              onClick={() => set('search', '')}
              aria-label="Hapus pencarian"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:shrink-0">
          <label className="relative">
            <span className="sr-only">Unit</span>
            <select
              value={filters.up3}
              onChange={(e) => set('up3', e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 lg:w-36"
            >
              <option value="all">Unit</option>
              {UP3_LIST.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </label>

          <label className="relative">
            <span className="sr-only">Status</span>
            <select
              value={filters.status}
              onChange={(e) => set('status', e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 lg:w-36"
            >
              <option value="all">Status</option>
              <option value="lengkap">Sudah Lengkap</option>
              <option value="sebagian">Perlu Dilengkapi</option>
              <option value="kosong">Belum Ada Tautan</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </label>

          <label className="relative">
            <span className="sr-only">Tipe siaran</span>
            <select
              value={filters.tipe}
              onChange={(e) => set('tipe', e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 lg:w-44"
            >
              <option value="all">Tipe Siaran</option>
              {tipeOptions.map((tipe) => <option key={tipe} value={tipe}>{tipe}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </label>
        </div>

        {/* Date Range Toggle */}
        <button
          onClick={() => setShowDateRange(!showDateRange)}
          className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all lg:shrink-0 ${
            showDateRange || filters.dateFrom || filters.dateTo
              ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:border-blue-200 hover:text-blue-700'
          }`}
        >
          <Calendar size={14} />
          Tanggal
        </button>

        {/* Reset */}
        {hasActiveFilter && (
          <button
            onClick={reset}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-500 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 lg:shrink-0"
          >
            <X size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Date Range Picker */}
      {showDateRange && (
        <div className="flex flex-col gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
            <SlidersHorizontal size={14} />
            Atur tanggal
          </div>
          <input
            type="date"
            value={formatDateForInput(filters.dateFrom)}
            onChange={(e) => set('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
            className="w-full rounded-lg border border-blue-100 bg-white px-2.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-auto"
          />
          <span className="text-xs text-slate-500">sampai</span>
          <input
            type="date"
            value={formatDateForInput(filters.dateTo)}
            onChange={(e) => set('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
            className="w-full rounded-lg border border-blue-100 bg-white px-2.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-auto"
          />
        </div>
      )}

      {activeDateRange && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Rentang aktif:</span>
          {filters.dateFrom && (
            <span className="px-2 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
              Dari {formatDateDisplay(filters.dateFrom)}
            </span>
          )}
          {filters.dateTo && (
            <span className="px-2 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
              Sampai {formatDateDisplay(filters.dateTo)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
