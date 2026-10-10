export default function PageHero({ eyebrow, title, description, children }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-blue-800 px-5 py-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:px-7">
      <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100 backdrop-blur-sm">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-blue-100/75">{description}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
