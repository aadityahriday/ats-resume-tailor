export default function LoadingSkeleton({ type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-border/50" />
          <div className="flex-1">
            <div className="h-6 bg-border/50 rounded w-3/4 mb-2" />
            <div className="h-4 bg-border/50 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-border/50 rounded w-full" />
          <div className="h-4 bg-border/50 rounded w-5/6" />
          <div className="h-4 bg-border/50 rounded w-4/6" />
        </div>
      </div>
    )
  }

  if (type === 'form') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-6 animate-pulse">
            <div className="h-5 bg-border/50 rounded w-1/3 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-border/50 rounded w-full" />
              <div className="h-4 bg-border/50 rounded w-full" />
              <div className="h-4 bg-border/50 rounded w-5/6" />
              <div className="h-4 bg-border/50 rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'workflow') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-border/50" />
            <div className="flex-1">
              <div className="h-4 bg-border/50 rounded w-1/2 mb-2" />
              <div className="h-3 bg-border/50 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'text') {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-border/50 rounded w-full" />
        <div className="h-4 bg-border/50 rounded w-full" />
        <div className="h-4 bg-border/50 rounded w-5/6" />
        <div className="h-4 bg-border/50 rounded w-4/6" />
      </div>
    )
  }

  return null
}
