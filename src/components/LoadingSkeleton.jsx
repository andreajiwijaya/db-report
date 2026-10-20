function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />
}

function SidebarSkeleton() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200/80 bg-white/75 p-4 lg:block">
      <Skeleton className="mx-auto mb-8 h-12 w-32 rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-11 w-full" />)}
      </div>
    </aside>
  )
}

function TopBarSkeleton() {
  return (
    <header className="border-b border-slate-200/70 bg-white/90 px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-6 w-52 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Skeleton className="h-10 w-44 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
      </div>
    </header>
  )
}

function DashboardSkeleton() {
  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-28 w-full rounded-2xl" />)}
        </div>
      </section>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <section key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Skeleton className="h-5 w-52" />
            <Skeleton className="mt-2 h-4 w-72 max-w-full" />
            <Skeleton className="mt-6 h-56 w-full rounded-2xl" />
          </section>
        ))}
      </div>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-2 h-4 w-72 max-w-full" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-28 w-full rounded-2xl" />)}
        </div>
      </section>
    </>
  )
}

function UnitPerformanceSkeleton() {
  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 h-8 w-56" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 8 }, (_, index) => (
          <section key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between">
              <div><Skeleton className="h-4 w-32" /><Skeleton className="mt-2 h-3 w-20" /></div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-6 h-2 w-full" />
            <div className="mt-4 flex justify-between"><Skeleton className="h-8 w-16" /><Skeleton className="h-8 w-16" /></div>
          </section>
        ))}
      </div>
    </>
  )
}

function EvidenceSkeleton() {
  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 h-8 w-40" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        <Skeleton className="mt-6 h-14 w-full rounded-2xl" />
      </section>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <Skeleton className="h-72 w-full rounded-2xl" />
      </section>
    </>
  )
}

function ActivitySkeleton() {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-100 p-6"><Skeleton className="h-8 w-56" /><Skeleton className="mt-3 h-4 w-96 max-w-full" /></div>
      <div className="grid grid-cols-2 gap-3 border-b border-slate-200 p-5 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-20 w-full rounded-2xl" />)}
      </div>
      <div className="space-y-3 p-5">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-24 w-full rounded-2xl" />)}</div>
    </section>
  )
}

function CalendarSkeleton() {
  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-3 w-28" /><Skeleton className="mt-3 h-8 w-64" /><Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </section>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><Skeleton className="h-112 w-full rounded-2xl" /></section>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><Skeleton className="h-6 w-40" /><Skeleton className="mt-3 h-4 w-56" /><Skeleton className="mt-6 h-32 w-full rounded-2xl" /></section>
      </div>
    </>
  )
}

export default function LoadingSkeleton({ activeMenu = 'dashboard' }) {
  const content = {
    dashboard: <DashboardSkeleton />,
    'unit-performance': <UnitPerformanceSkeleton />,
    evidence: <EvidenceSkeleton />,
    activity: <ActivitySkeleton />,
    calendar: <CalendarSkeleton />,
  }[activeMenu] ?? <DashboardSkeleton />

  return (
    <div className="flex min-h-dvh bg-slate-50">
      <SidebarSkeleton />
      <div className="min-w-0 flex-1 overflow-hidden">
        <TopBarSkeleton />
        <main className="space-y-6 p-3 pb-24 sm:p-6">{content}</main>
      </div>
    </div>
  )
}