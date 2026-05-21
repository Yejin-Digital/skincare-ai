import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProductIds, getProductById } from "@/lib/data/products";
import {
  PRODUCT_CATEGORY_LABELS,
  type Product,
} from "@/types/product";
import {
  SKIN_TYPE_LABELS,
  SKIN_CONCERN_LABELS,
} from "@/types/diagnosis";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

// ─── SSG: 빌드 시 모든 제품 ID를 정적 생성 ──────────────────────

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return getAllProductIds().map((id) => ({ id }));
}

// ─── 메타데이터 ───────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<{ title: string; description: string }> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "제품을 찾을 수 없음", description: "" };
  return {
    title: `${product.name} | Skincare AI`,
    description: product.description,
  };
}

// ─── 아이콘 ───────────────────────────────────────────────────────

function ArrowLeftIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 3L5 8l5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarFilledIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1l1.5 3.5H12l-3 2.2 1.2 3.5L7 8.5l-3.2 1.7L5 6.7 2 4.5h3.5L7 1z"
        fill="#D97706"
      />
    </svg>
  );
}

// ─── 섹션 컴포넌트 ───────────────────────────────────────────────

interface TagListProps {
  items: string[];
}
function TagList({ items }: TagListProps): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="text-xs px-3 py-1 rounded-full border border-border-default text-text-body bg-surface-section"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}
function Section({ title, children }: SectionProps): React.ReactElement {
  return (
    <div>
      <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── 페이지 ───────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const {
    name,
    brand,
    category,
    price,
    rating,
    reviewCount,
    description,
    howToUse,
    skinTypes,
    concerns,
    keyIngredientNames,
  } = product as Product;

  const skinTypeLabels = skinTypes.map((t) => SKIN_TYPE_LABELS[t]);
  const concernLabels  = concerns.map((c) => SKIN_CONCERN_LABELS[c]);

  return (
    <div className="min-h-screen bg-surface-page">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-10 bg-surface-page/80 backdrop-blur-sm border-b border-border-subtle">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/results"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2"
            )}
            aria-label="결과 페이지로 돌아가기"
          >
            <ArrowLeftIcon />
            뒤로
          </Link>
          <span className="text-sm font-medium text-text-muted truncate">
            제품 상세
          </span>
        </div>
      </header>

      {/* ── 본문 ── */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">

          {/* 제품 이미지 플레이스홀더 */}
          <div className="w-full aspect-square rounded-2xl bg-surface-section flex items-center justify-center">
            <span className="text-7xl" role="img" aria-label="제품 이미지">
              🧴
            </span>
          </div>

          {/* 기본 정보 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">
                {PRODUCT_CATEGORY_LABELS[category]}
              </span>
            </div>
            <p className="text-sm text-text-muted mb-1">{brand}</p>
            <h1 className="text-xl font-bold text-text-heading leading-snug mb-3">
              {name}
            </h1>

            {/* 별점 */}
            <div className="flex items-center gap-2 mb-3">
              <StarFilledIcon />
              <span className="text-sm font-semibold text-text-heading">
                {rating.toFixed(1)}
              </span>
              <span className="text-sm text-text-muted">
                ({reviewCount.toLocaleString()}개 리뷰)
              </span>
            </div>

            {/* 가격 */}
            <p className="text-2xl font-bold text-text-heading">
              {price.toLocaleString()}
              <span className="text-base font-normal text-text-muted ml-1">원</span>
            </p>
          </div>

          <hr className="border-border-subtle" />

          {/* 제품 설명 */}
          <Section title="제품 소개">
            <p className="text-sm text-text-body leading-relaxed">{description}</p>
          </Section>

          {/* 핵심 성분 */}
          <Section title="핵심 성분">
            <TagList items={keyIngredientNames} />
          </Section>

          {/* 적합 피부 타입 */}
          <Section title="적합 피부 타입">
            <TagList items={skinTypeLabels} />
          </Section>

          {/* 도움되는 피부 고민 */}
          <Section title="도움되는 피부 고민">
            <TagList items={concernLabels} />
          </Section>

          {/* 사용법 */}
          <Section title="사용법">
            <div className="bg-surface-section rounded-xl px-4 py-4">
              <p className="text-sm text-text-body leading-relaxed">{howToUse}</p>
            </div>
          </Section>

          {/* 면책 조항 */}
          <p className="text-xs text-text-muted text-center leading-relaxed px-4 pb-8">
            이 제품 정보는 AI 기반 데이터이며 실제 제품 사양과 다를 수 있습니다.
            구매 전 공식 제품 페이지를 확인하세요.
          </p>
        </div>
      </main>
    </div>
  );
}
