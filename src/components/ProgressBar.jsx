import clsx from 'clsx'
import { STATUS_COLOR } from '../utils/constants'

function getColorByPct(pct) {
  if (pct >= 100) return STATUS_COLOR.lengkap.bar
  if (pct >= 50) return STATUS_COLOR.sebagian.bar
  return STATUS_COLOR.kosong.bar
}

export default function ProgressBar({ pct = 0, height = 'h-2', showLabel = false }) {
  const color = getColorByPct(pct)
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500">Kelengkapan link</span>
          <span className="text-xs font-semibold text-slate-700">{pct}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-slate-100 rounded-full overflow-hidden', height)}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
