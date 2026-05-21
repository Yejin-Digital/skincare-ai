import type { SkinType, SkinConcern } from "@/types/diagnosis";

// ─── 제품 카테고리 ────────────────────────────────────────────────

export const PRODUCT_CATEGORY_LABELS = {
  serum:       "세럼",
  toner:       "토너",
  moisturizer: "모이스처라이저",
  sunscreen:   "선케어",
  cleanser:    "클렌저",
  mask:        "마스크팩",
  eye_cream:   "아이크림",
} as const;

export type ProductCategory = keyof typeof PRODUCT_CATEGORY_LABELS;

// ─── 제품 ─────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  /** 가격 (원) */
  price: number;
  /** 적합 피부 타입 */
  skinTypes: SkinType[];
  /** 도움되는 피부 고민 */
  concerns: SkinConcern[];
  /**
   * 핵심 성분 (소문자 영문, 매칭용).
   * AI 추천 englishName과 비교할 때 사용.
   */
  keyIngredients: string[];
  /** 핵심 성분 (한국어, 표시용) */
  keyIngredientNames: string[];
  /** 제품 설명 */
  description: string;
  /** 사용법 */
  howToUse: string;
  /** 평점 (1~5) */
  rating: number;
  /** 리뷰 수 */
  reviewCount: number;
}
