import productsData from "@/data/products.json";
import type { Product } from "@/types/product";

// JSON을 Product[] 타입으로 캐스팅
const PRODUCTS = productsData as Product[];

// ─── 조회 함수 ────────────────────────────────────────────────────

/** 전체 제품 목록 반환 */
export function getAllProducts(): Product[] {
  return PRODUCTS;
}

/** ID로 단일 제품 반환 */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** 모든 제품 ID 반환 (generateStaticParams용) */
export function getAllProductIds(): string[] {
  return PRODUCTS.map((p) => p.id);
}

/**
 * AI가 추천한 성분 영문명 목록을 기반으로 관련 제품을 찾아 반환합니다.
 *
 * 매칭 방식: AI 추천 성분명(englishName)과 제품의 keyIngredients를
 * 소문자로 변환 후 부분 문자열 포함 여부로 비교합니다.
 *
 * @param englishNames - AI가 추천한 성분의 영문명 배열
 * @param limit - 반환할 최대 제품 수 (기본 4)
 */
export function getProductsByIngredients(
  englishNames: string[],
  limit = 4
): Product[] {
  const normalized = englishNames.map((n) => n.toLowerCase().trim());

  const scored = PRODUCTS.map((product) => {
    const matches = product.keyIngredients.filter((ki) =>
      normalized.some(
        (name) => ki.includes(name) || name.includes(ki)
      )
    ).length;
    return { product, matches };
  });

  return scored
    .filter(({ matches }) => matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .slice(0, limit)
    .map(({ product }) => product);
}
