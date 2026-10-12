import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { calcUP3Stats } from '../utils/dataUtils'
import { STATUS_COLOR } from '../utils/constants'

export default function UP3StatusChart({ data, up3 }) {
  const stats = calcUP3Stats(data, up3.id)

  const chartData = [
    { name: 'Sudah lengkap', value: stats.lengkap, status: 'lengkap' },
    { name: 'Perlu dilengkapi', value: stats.sebagian, status: 'sebagian' },
    { name: 'Belum ada tautan', value: stats.kosong, status: 'kosong' },
  ].filter(item => item.value > 0)

  const getColor = (name) => {
    const item = chartData.find((entry) => entry.name === name)
    return STATUS_COLOR[item?.status || 'kosong']?.bar || STATUS_COLOR.kosong.bar
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
        <p className="text-slate-500">Belum ada data untuk unit ini</p>
      </div>
    )
  }

  const totalLinks = stats.totalLinks
  const avgLinksPerEvidence = stats.total > 0 ? (totalLinks / stats.total).toFixed(1) : 0

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Distribusi Status</h3>
        <p className="text-sm text-slate-500">Rincian Siaran Pers berdasarkan kelengkapan link</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="flex items-center justify-center h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => [`${value} Siaran Pers`, 'Jumlah']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {chartData.map((item) => (
            <div key={item.name} className="rounded-xl border border-slate-100 p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(item.name) }} />
                  <span className="font-medium text-slate-900">{item.name}</span>
                </div>
                <span className="text-lg font-bold text-slate-800">{item.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: getColor(item.name),
                    width: `${stats.total > 0 ? (item.value / stats.total) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {((item.value / stats.total) * 100).toFixed(1)}% dari total Siaran Pers
              </p>
            </div>
          ))}

          {/* Overall stats */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-4">
            <p className="text-sm text-blue-700 font-semibold mb-3">Ringkasan</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-600">Total Siaran Pers</span>
                <span className="font-bold text-blue-900">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Total Link Terisi</span>
                <span className="font-bold text-blue-900">{totalLinks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Rata-rata Link/Siaran Pers</span>
                <span className="font-bold text-blue-900">{avgLinksPerEvidence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Kelengkapan Link</span>
                <span className="font-bold text-blue-900">{stats.pctLinks}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
