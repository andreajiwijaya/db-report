import clsx from 'clsx'
import { TOTAL_LINKS } from '../utils/constants'

export default function LinkDots({ links = [], size = 'md', showLabel = false }) {
  const dotSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
  const visibleLinks = Array.from({ length: TOTAL_LINKS }, (_, index) => links[index] || '')

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visibleLinks.map((link, i) => (
        <a
          key={i}
          href={link || undefined}
          target="_blank"
          rel="noopener noreferrer"
          title={link ? `Link ${i + 1}: ${link}` : `Link ${i + 1} belum diisi`}
          aria-label={link ? `Buka link Siaran Pers ${i + 1}` : `Link Siaran Pers ${i + 1} belum diisi`}
          className={clsx(
            dotSize,
            'group relative rounded-md shrink-0 border transition-all duration-150',
            link
              ? 'border-emerald-600 bg-emerald-500 shadow-sm shadow-emerald-200 cursor-pointer hover:scale-125 hover:bg-emerald-600 hover:shadow-md'
              : 'border-slate-200 bg-slate-100 cursor-default'
          )}
          onClick={(e) => !link && e.preventDefault()}
        />
      ))}
      {showLabel && (
        <span className="text-xs text-slate-400 ml-1">
          {visibleLinks.filter(Boolean).length}/{TOTAL_LINKS}
        </span>
      )}
    </div>
  )
}
