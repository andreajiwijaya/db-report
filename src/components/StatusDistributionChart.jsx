import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { REQUIRED_LINKS } from '../utils/constants'

export default function StatusDistributionChart({ data = [] }) {
  // Pastikan `data` selalu array
  const total = Array.isArray(data) ? data.length : 0

  // Hitung distribusi status dengan aman
  const lengkap = total > 0 ? data.filter((d) => d.status === 'lengkap').length : 0
  const sebagian = total > 0 ? data.filter((d) => d.status === 'sebagian').length : 0
  const kosong = total > 0 ? data.filter((d) => d.status === 'kosong').length : 0

  const chartData = [
    { name: 'Sudah lengkap', value: lengkap, color: '#10b981' },
    { name: 'Perlu dilengkapi', value: sebagian, color: '#f59e0b' },
    { name: 'Belum ada tautan', value: kosong, color: '#cbd5e1' },
  ].filter((item) => item.value > 0)

  const pct = {
    lengkap: total > 0 ? Math.round((lengkap / total) * 100) : 0,
    sebagian: total > 0 ? Math.round((sebagian / total) * 100) : 0,
    kosong: total > 0 ? Math.round((kosong / total) * 100) : 0,
  }

  if (total === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center">
        <h3 className="text-lg font-bold text-slate-900">Distribusi Status Siaran Pers</h3>
        <p className="text-sm text-slate-500 mt-2">Belum ada data Siaran Pers untuk ditampilkan.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-200 hover:shadow-md">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">Distribusi Status Siaran Pers</h3>
        <p className="text-sm text-slate-500">Persentase Siaran Pers dengan minimal 6 dari 10 link terisi</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Sudah lengkap (minimal {REQUIRED_LINKS} link)</p>
                <p className="text-xs text-blue-600 mt-1">Minimal 6 dari 10 link sudah diisi</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-700">{lengkap}</p>
                <p className="text-xs text-blue-600">{pct.lengkap}%</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-800 font-medium">Perlu dilengkapi (1-{REQUIRED_LINKS - 1} link)</p>
                <p className="text-xs text-yellow-700 mt-1">Baru 1–5 link dari seluruh kolom yang terisi</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-800">{sebagian}</p>
                <p className="text-xs text-yellow-700">{pct.sebagian}%</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700 font-medium">Belum ada tautan (0 link)</p>
                <p className="text-xs text-slate-500 mt-1">Belum ada tautan Siaran Pers</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-700">{kosong}</p>
                <p className="text-xs text-slate-500">{pct.kosong}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
