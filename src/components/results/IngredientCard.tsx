import { cn } from "@/lib/utils/cn";
import type { Ingredient } from "@/types/analysis";

// ─── 아이콘 (인라인 SVG) ──────────────────────────────────────────

function SparkleIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1l1.5 3.5L12 6l-3.5 1.5L7 11l-1.5-3.5L2 6l3.5-1.5L7 1z"
        fill="currentColor"
      />
    </svg>
  );
}

function AlertIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1L13 12H1L7 1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="7" y1="5.5" x2="7" y2="8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="10.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function DropletIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 2C7 2 2.5 7 2.5 9.5a4.5 4.5 0 009 0C11.5 7 7 2 7 2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ─── 타입 ─────────────────────────────────────────────────────────

interface IngredientCardProps {
  ingredient: Ingredient;
  /** 1-based 순서 번호 */
  index: number;
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────

export default function IngredientCard({
  ingredient,
  index,
}: IngredientCardProps): React.ReactElement {
  const { name, englishName, effect, reason, caution, usage } = ingredient;

  return (
    <article className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
      {/* 카드 헤더 */}
      <div className="flex items-start gap-4 px-5 pt-5 pb-4 border-b border-border-subtle">
        {/* 순서 번호 */}
        <span
          className={cn(
            "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            "text-xs font-bold bg-primary-100 text-primary-700"
          )}
          aria-label={`성분 ${index}번`}
        >
          {String(index).padStart(2, "0")}
        </span>

        {/* 성분명 */}
        <div className="min-w-0">
          <h3 className="text-base font-bold text-text-heading leading-snug">
            {name}
          </h3>
          <p className="text-xs text-text-muted mt-0.5 tracking-wide">
            {englishName}
          </p>
        </div>
      </div>

      {/* 카드 본문 */}
      <div className="px-5 py-4 flex flex-col gap-4">

        {/* 주요 효능 */}
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            주요 효능
          </p>
          <p className="text-sm text-text-body leading-relaxed">{effect}</p>
        </div>

        {/* 추천 이유 — 강조 블록 */}
        <div className="bg-primary-50 rounded-xl px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 mb-1">
            <SparkleIcon />
            이 분석에서 추천하는 이유
          </p>
          <p className="text-sm text-primary-800 leading-relaxed">{reason}</p>
        </div>

        {/* 사용법 */}
        <div className="flex items-start gap-2">
          <span className="shrink-0 mt-0.5 text-text-muted">
            <DropletIcon />
          </span>
          <p className="text-sm text-text-body leading-relaxed">{usage}</p>
        </div>

        {/* 주의사항 (조건부) */}
        {caution && (
          <div className="bg-warning-bg rounded-xl px-4 py-3 flex items-start gap-2">
            <span className="shrink-0 mt-0.5 text-warning">
              <AlertIcon />
            </span>
            <p className="text-sm text-text-body leading-relaxed">{caution}</p>
          </div>
        )}
      </div>
    </article>
  );
}
