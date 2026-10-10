import { getMonthlyPublicationStats } from '../utils/dataUtils'
import { UP3_LIST } from '../utils/constants'

export default function UP3CompletionTable({ data = [], monthLabel = 'bulan terbaru', monthKey = null }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Capaian Publikasi per Unit</h3>
          <p className="text-sm text-slate-500">Realisasi bulan {monthLabel}, dibanding target 3 publikasi</p>
        </div>
      </div>

      <div className="space-y-3">
        {UP3_LIST.map((up3) => {
          const monthlyStats = getMonthlyPublicationStats(data, up3.id)
          const realisasi = monthKey ? monthlyStats.get(monthKey) || 0 : data.filter((item) => item.up3 === up3.id).length
          const target = 3
          const capaian = Math.round((realisasi / target) * 100)
          return (
            <div key={up3.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-100">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{up3.label}</p>
                <p className="text-xs text-slate-500">{up3.area}</p>
              </div>

              <div className="flex-1 px-4">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(capaian, 100)}%` }} />
                </div>
              </div>

              <div className="w-28 text-right">
                <p className="text-sm font-bold text-slate-900">{capaian}%</p>
                <p className="text-xs text-slate-500">{realisasi}/{target} publikasi</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
