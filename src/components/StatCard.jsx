import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, prefix = '', suffix = '', trend, trendPercent, trendDirection = 'up' }) {
  const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown
  const trendColor = trendDirection === 'up' ? 'text-blue-700 bg-blue-100' : 'text-yellow-800 bg-yellow-100'

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">
              {prefix}{value}{suffix}
            </h3>
            {trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${trendColor}`}>
                <TrendIcon size={14} />
                {trendPercent}%
              </div>
            )}
          </div>
          {trend && (
            <p className="text-xs text-slate-500 mt-2">
              {trendDirection === 'up' ? 'Peningkatan' : 'Penurunan'} bulan ini
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center ml-3 border border-blue-100">
            <Icon size={24} className="text-blue-600" />
          </div>
        )}
      </div>
    </div>
  )
}
