import { Trophy, TrendingUp } from 'lucide-react'

export default function QualityScoreCard({ score = 0, label = 'Quality Score', trend = false, trendPercent = 0, trendDirection = 'up' }) {
  // Determine color based on score
  const getScoreColor = (s) => {
    if (s >= 80) return { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', text: 'text-green-900', badge: 'bg-green-100 text-green-800' }
    if (s >= 60) return { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' }
    if (s >= 40) return { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: 'text-yellow-600', text: 'text-yellow-900', badge: 'bg-yellow-100 text-yellow-800' }
    return { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', text: 'text-red-900', badge: 'bg-red-100 text-red-800' }
  }

  const colors = getScoreColor(score)

  const getScoreLabel = (s) => {
    if (s >= 80) return 'Excellent'
    if (s >= 60) return 'Good'
    if (s >= 40) return 'Fair'
    return 'Poor'
  }

  return (
    <div className={`card p-5 border rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${colors.border} ${colors.bg}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>{label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className={`text-3xl font-bold ${colors.text}`}>{score}</p>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors.badge}`}>/100</span>
          </div>
          <p className={`text-xs ${colors.text} mt-1 opacity-75`}>{getScoreLabel(score)}</p>
        </div>
        <Trophy size={24} className={colors.icon} />
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-current border-opacity-10">
          <div className="flex items-center gap-1.5">
            <TrendingUp
              size={14}
              className={trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}
            />
            <span className={`text-xs font-semibold ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trendDirection === 'up' ? '+' : '-'}{trendPercent}%
            </span>
            <span className="text-xs text-slate-500">dari bulan lalu</span>
          </div>
        </div>
      )}
    </div>
  )
}
