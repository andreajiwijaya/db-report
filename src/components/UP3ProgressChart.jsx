import { UP3_LIST, MONTHLY_PUBLICATION_TARGET } from '../utils/constants'
import { getMonthlyPublicationStats, getPublicationDate } from '../utils/dataUtils'

function monthLabel(key) {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'short' })
}

export default function UP3ProgressChart({ rawData }) {
  const months = [...new Set(
    rawData
      .map(getPublicationDate)
      .filter(Boolean)
      .map((date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  )].sort()

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:shadow-md">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">Realisasi Publikasi per Unit</h3>
        <p className="text-sm text-slate-500">Capaian dihitung dari jumlah siaran pers dibanding target {MONTHLY_PUBLICATION_TARGET} publikasi per bulan.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-3">Unit</th>
              {months.map((month) => <th key={month} className="px-3 py-3 text-center">{monthLabel(month)}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {UP3_LIST.map((unit) => {
              const stats = getMonthlyPublicationStats(rawData, unit.id)
              return (
                <tr key={unit.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-700">{unit.label}</td>
                  {months.map((month) => {
                    const count = stats.get(month) || 0
                    const capaian = Math.round((count / MONTHLY_PUBLICATION_TARGET) * 100)
                    const tone = count === 0 ? 'bg-red-50 text-red-700' : capaian >= 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    return (
                      <td key={month} className="px-3 py-2 text-center">
                        <div className={`rounded-lg px-2 py-1.5 ${tone}`}>
                          <p className="font-bold">{count}</p>
                          <p className="text-[10px] font-semibold">{capaian}%</p>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-500">Rumus capaian: jumlah publikasi ÷ {MONTHLY_PUBLICATION_TARGET} × 100%. Contoh: 2 publikasi = 67%, 5 publikasi = 167%.</p>
    </div>
  )
}
