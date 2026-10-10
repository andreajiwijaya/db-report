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

export default function LoadingSkeleton() {
  return (
    <div className="flex min-h-dvh bg-slate-50">
      <SidebarSkeleton />
      <div className="min-w-0 flex-1 overflow-hidden">
        <TopBarSkeleton />
        <main className="space-y-6 p-3 pb-24 sm:p-6">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="rounded-2xl bg-slate-100 p-5 sm:p-7">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="mt-3 h-8 w-64 max-w-full" />
              <Skeleton className="mt-3 h-4 w-96 max-w-full" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="rounded-2xl border border-slate-100 p-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-3 h-8 w-16" />
                  <Skeleton className="mt-4 h-3 w-28" />
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <section key={index} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="mt-2 h-4 w-64 max-w-full" />
                <Skeleton className="mt-6 h-56 w-full rounded-2xl" />
              </section>
            ))}
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72 max-w-full" />
              </div>
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-28 w-full rounded-2xl" />)}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
