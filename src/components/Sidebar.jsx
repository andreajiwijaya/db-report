import { LayoutDashboard, FileText, CalendarDays, ListChecks, BarChart3 } from 'lucide-react'
import plnLogo from '../assets/LOGO PLN UID RIAU KEPRI.png'

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'unit-performance', label: 'Performa Unit', icon: BarChart3 },
    { id: 'evidence', label: 'Evidence', icon: FileText },
    { id: 'activity', label: 'Activity Log', icon: ListChecks },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  ]

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 flex h-[68px] items-center border-t border-slate-200/80 bg-white/90 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:sticky lg:top-0 lg:bottom-auto lg:h-dvh lg:w-60 lg:shrink-0 lg:flex-col lg:items-stretch lg:border-r lg:border-t-0 lg:bg-white/75 lg:px-0 lg:pb-0 lg:shadow-[1px_0_0_rgba(15,23,42,0.02)]">
      <div className="hidden px-5 py-5 lg:flex lg:items-center lg:justify-center">
        <img
          src={plnLogo}
          alt="PLN UID Riau & Kepri"
          className="w-full max-w-36 object-contain drop-shadow-sm"
        />
      </div>

      <div className="flex w-full items-center justify-around lg:flex-1 lg:items-stretch lg:py-4">
        <nav className="flex w-full items-center justify-around gap-1 overflow-x-auto px-1 lg:block lg:space-y-1 lg:overflow-visible lg:px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.id

            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex min-w-[68px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold transition-all sm:min-w-[76px] lg:w-full lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-3 lg:py-3 lg:text-sm ${
                  isActive ? 'bg-blue-600 text-white shadow-[0_7px_18px_rgba(37,99,235,0.22)] lg:bg-blue-50 lg:text-blue-700 lg:shadow-none' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Icon size={19} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
