import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { formatTanggal } from '../utils/dataUtils'
import StatusBadge from './StatusBadge'
import LinkDots from './LinkDots'

const COLS = [
  { key: 'no',     label: '#',              sortable: false, width: 'w-10' },
  { key: 'up3Raw', label: 'Unit',           sortable: true,  width: 'w-36' },
  { key: 'tipe',   label: 'Tipe Siaran',    sortable: true,  width: 'w-44' },
  { key: 'judul',  label: 'Judul Evidence', sortable: true,  width: '' },
  { key: 'tanggal',label: 'Tanggal',        sortable: true,  width: 'w-28' },
  { key: 'links',  label: 'Link (10)',       sortable: false, width: 'w-40' },
  { key: 'status', label: 'Status',         sortable: true,  width: 'w-28' },
]

export default function EvidenceTable({ data }) {
  const [sortKey, setSortKey] = useState('tanggal')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const handleSort = (key) => {
    if (!key) return
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const sorted = [...data].sort((a, b) => {
    let va = a[sortKey]
    let vb = b[sortKey]
    if (sortKey === 'tanggal') {
      va = va ? va.getTime() : 0
      vb = vb ? vb.getTime() : 0
    } else if (sortKey === 'status') {
      const order = { lengkap: 0, sebagian: 1, kosong: 2 }
      va = order[va] ?? 3
      vb = order[vb] ?? 3
    } else {
      va = String(va ?? '').toLowerCase()
      vb = String(vb ?? '').toLowerCase()
    }
    if (va < vb) return sortDir === 'asc' ? -1 : 1
    if (va > vb) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const SortIcon = ({ col }) => {
    if (!col.sortable) return null
    if (sortKey !== col.key) return <ChevronUp size={12} className="text-slate-300 ml-1" />
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-pln-blue ml-1" />
      : <ChevronDown size={12} className="text-pln-blue ml-1" />
  }

  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-400 text-sm">Tidak ada data yang sesuai filter</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {COLS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide
                    ${col.width} ${col.sortable ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                >
                  <span className="flex items-center">
                    {col.label}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((row, i) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {(page - 1) * PER_PAGE + i + 1}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {row.up3Raw}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-slate-600">{row.tipe || '-'}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-700 font-medium text-sm leading-snug line-clamp-2">
                    {row.judul || <span className="text-slate-400 italic">Tanpa judul</span>}
                  </p>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                  {formatTanggal(row.tanggal)}
                </td>
                <td className="px-4 py-3">
                  <LinkDots links={row.links} showLabel />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, sorted.length)} dari {sorted.length} evidence
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-xs text-slate-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 text-xs rounded-lg border ${
                      page === p
                        ? 'bg-pln-blue text-white border-pln-blue'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
