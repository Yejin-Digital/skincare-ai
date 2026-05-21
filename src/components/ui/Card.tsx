import { cn } from "@/lib/utils/cn";

// ─── 타입 ──────────────────────────────────────────────────────────

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: React.ReactNode;
  /** 내부 패딩 크기 (기본: md) */
  padding?: CardPadding;
  /** 추가 클래스 */
  className?: string;
  /**
   * 렌더링할 HTML 요소 (기본: div).
   * 예: article, section, li
   */
  as?: React.ElementType;
}

// ─── 스타일 맵 ─────────────────────────────────────────────────────

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

// ─── 컴포넌트 ──────────────────────────────────────────────────────

/**
 * 공통 카드 컴포넌트.
 * 배경, 테두리, 그림자가 디자인 토큰으로 관리됩니다.
 *
 * @example
 * <Card padding="md">
 *   <h2 className="text-text-heading">성분 추천</h2>
 * </Card>
 *
 * <Card as="article" padding="lg" className="hover:shadow-md">
 *   <ProductInfo />
 * </Card>
 */
export default function Card({
  children,
  padding = "md",
  className,
  as: Tag = "div",
}: CardProps): React.ReactElement {
  return (
    <Tag
      className={cn(
        "bg-surface-card",
        "border border-border-subtle",
        "rounded-xl",
        "shadow-sm",
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </Tag>
  );
}
