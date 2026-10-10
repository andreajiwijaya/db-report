import clsx from 'clsx'
import { STATUS_COLOR, getStatusLabel } from '../utils/constants'

export default function StatusBadge({ status, size = 'sm' }) {
  const c = STATUS_COLOR[status] ?? STATUS_COLOR.kosong
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-semibold',
        c.bg,
        c.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {getStatusLabel(status)}
    </span>
  )
}
