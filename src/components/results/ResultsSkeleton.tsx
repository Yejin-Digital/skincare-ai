// 로딩 중 표시되는 스켈레톤 UI

// ─── 단일 성분 카드 스켈레톤 ─────────────────────────────────────

function IngredientCardSkeleton(): React.ReactElement {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm animate-pulse">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-border-subtle">
        <div className="w-8 h-8 rounded-full bg-neutral-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-2/5" />
          <div className="h-3 bg-neutral-100 rounded w-1/4" />
        </div>
      </div>

      {/* 본문 */}
      <div className="px-5 py-4 space-y-4">
        <div className="space-y-2">
          <div className="h-3 bg-neutral-100 rounded w-1/5" />
          <div className="h-3 bg-neutral-200 rounded w-full" />
          <div className="h-3 bg-neutral-200 rounded w-4/5" />
        </div>
        <div className="bg-neutral-100 rounded-xl px-4 py-3 space-y-2">
          <div className="h-3 bg-neutral-200 rounded w-2/5" />
          <div className="h-3 bg-neutral-200 rounded w-full" />
          <div className="h-3 bg-neutral-200 rounded w-3/4" />
        </div>
        <div className="h-3 bg-neutral-200 rounded w-4/5" />
      </div>
    </div>
  );
}

// ─── 요약 스켈레톤 ────────────────────────────────────────────────

function SummarySkeleton(): React.ReactElement {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-2xl px-6 py-5 shadow-sm animate-pulse space-y-3">
      <div className="h-4 bg-neutral-200 rounded w-1/4" />
      <div className="space-y-2">
        <div className="h-3 bg-neutral-200 rounded w-full" />
        <div className="h-3 bg-neutral-200 rounded w-full" />
        <div className="h-3 bg-neutral-200 rounded w-3/4" />
      </div>
    </div>
  );
}

// ─── 전체 스켈레톤 ────────────────────────────────────────────────

export default function ResultsSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {/* 로딩 인디케이터 텍스트 */}
      <div className="text-center py-4">
        <p className="text-sm text-text-muted animate-pulse">
          AI가 피부를 분석하고 있어요...
        </p>
      </div>

      {/* 요약 스켈레톤 */}
      <SummarySkeleton />

      {/* 성분 카드 스켈레톤 × 3 */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <IngredientCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
