import clsx from 'clsx'
import { calcUP3Stats, getMonthKey, getMonthlyPublicationStats, getPublicationDate } from '../utils/dataUtils'
import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'

export default function UP3Card({ up3, data, monthKey = null, isActive, onClick }) {
  const monthlyStats = getMonthlyPublicationStats(data, up3.id)
  const monthlyTotal = monthKey ? monthlyStats.get(monthKey) || 0 : null
  const monthlyData = monthKey
    ? data.filter((item) => item.up3 === up3.id && getMonthKey(getPublicationDate(item)) === monthKey)
    : data
  const stats = monthKey
    ? { ...calcUP3Stats(monthlyData, up3.id), total: monthlyTotal, publicationTarget: 3, publicationCapaian: Math.round((monthlyTotal / 3) * 100) }
    : calcUP3Stats(data, up3.id)
  const publicationComplete = stats.total >= stats.publicationTarget
  const cardStatus = stats.total === 0
    ? 'kosong'
    : publicationComplete && stats.lengkap === stats.total
      ? 'lengkap'
      : stats.kosong === stats.total
        ? 'kosong'
        : 'sebagian'

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl',
        isActive
          ? 'ring-2 ring-blue-500 border-blue-500'
          : 'hover:border-blue-200'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-semibold text-slate-800 text-sm sm:text-[15px] leading-tight">{up3.label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{up3.area}</p>
        </div>
        <StatusBadge status={cardStatus} />
      </div>

      {/* Progress */}
      <ProgressBar pct={Math.min(stats.publicationCapaian, 100)} height="h-1.5" />

      {/* Stats row */}
      <div className="flex items-center justify-between mt-3 gap-3">
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-lg font-bold text-slate-800 leading-none">{stats.publicationCapaian}%</p>
            <p className="text-xs text-slate-400 mt-0.5">capaian publikasi</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 leading-none">
              {stats.total}
              <span className="text-slate-400 font-normal text-sm">/{stats.publicationTarget}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">publikasi tercatat</p>
          </div>
        </div>
        <p className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
          {stats.total} evidence
        </p>
      </div>
    </button>
  )
}
