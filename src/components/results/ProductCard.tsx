import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { PRODUCT_CATEGORY_LABELS, type Product } from "@/types/product";

// ─── 별점 표시 ────────────────────────────────────────────────────

interface StarRatingProps {
  rating: number;
}
function StarRating({ rating }: StarRatingProps): React.ReactElement {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <span className="flex items-center gap-0.5" aria-label={`별점 ${rating}점`}>
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={`f-${i}`} type="full" />
      ))}
      {half === 1 && <StarIcon type="half" />}
      {Array.from({ length: empty }).map((_, i) => (
        <StarIcon key={`e-${i}`} type="empty" />
      ))}
    </span>
  );
}

function StarIcon({
  type,
}: {
  type: "full" | "half" | "empty";
}): React.ReactElement {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      {type === "full" && (
        <path
          d="M6 1l1.3 3h3.2l-2.6 1.9 1 3L6 7.3 3.1 8.9l1-3L1.5 4h3.2L6 1z"
          fill="#D97706"
        />
      )}
      {type === "half" && (
        <>
          <path
            d="M6 1l1.3 3h3.2l-2.6 1.9 1 3L6 7.3V1z"
            fill="#D97706"
          />
          <path
            d="M6 1v6.3L3.1 8.9l1-3L1.5 4h3.2L6 1z"
            fill="#E5E3DE"
          />
        </>
      )}
      {type === "empty" && (
        <path
          d="M6 1l1.3 3h3.2l-2.6 1.9 1 3L6 7.3 3.1 8.9l1-3L1.5 4h3.2L6 1z"
          fill="#E5E3DE"
        />
      )}
    </svg>
  );
}

// ─── 제품 카드 ────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps): React.ReactElement {
  const { id, name, brand, category, price, rating, reviewCount, keyIngredientNames } =
    product;

  return (
    <Link
      href={`/products/${id}`}
      className={cn(
        "block bg-surface-card border border-border-subtle rounded-2xl",
        "p-4 shadow-sm transition-shadow duration-150",
        "hover:shadow-md hover:border-primary-300 focus-visible:outline-primary-500"
      )}
    >
      {/* 이미지 플레이스홀더 */}
      <div className="w-full aspect-square rounded-xl bg-surface-section flex items-center justify-center mb-3 overflow-hidden">
        <span className="text-4xl" role="img" aria-label="제품 이미지">
          🧴
        </span>
      </div>

      {/* 카테고리 뱃지 */}
      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 mb-1">
        {PRODUCT_CATEGORY_LABELS[category]}
      </span>

      {/* 브랜드 + 제품명 */}
      <p className="text-xs text-text-muted mb-0.5">{brand}</p>
      <h3 className="text-sm font-semibold text-text-heading leading-snug line-clamp-2 mb-2">
        {name}
      </h3>

      {/* 핵심 성분 태그 */}
      <div className="flex flex-wrap gap-1 mb-3">
        {keyIngredientNames.slice(0, 2).map((ing) => (
          <span
            key={ing}
            className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-text-muted"
          >
            {ing}
          </span>
        ))}
      </div>

      {/* 별점 + 가격 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <StarRating rating={rating} />
          <span className="text-[11px] text-text-muted">
            ({reviewCount.toLocaleString()})
          </span>
        </div>
        <span className="text-sm font-bold text-text-heading">
          {price.toLocaleString()}원
        </span>
      </div>
    </Link>
  );
}
