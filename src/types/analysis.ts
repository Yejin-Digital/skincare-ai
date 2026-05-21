import { z } from "zod";

// ─── 추천 성분 ────────────────────────────────────────────────────

export const IngredientSchema = z.object({
  /** 한국어 성분명 */
  name: z.string(),
  /** 영문 성분명 */
  englishName: z.string(),
  /** 주요 효능 */
  effect: z.string(),
  /** 이 사용자에게 특별히 추천하는 이유 */
  reason: z.string(),
  /** 주의사항 (없을 수도 있음) */
  caution: z.string().optional(),
  /** 사용법 및 제형 추천 */
  usage: z.string(),
});
export type Ingredient = z.infer<typeof IngredientSchema>;

// ─── 성분 조합 노트 ──────────────────────────────────────────────

export const CombinationNotesSchema = z.object({
  /** 함께 쓰면 시너지가 나는 조합 */
  synergy: z.string().optional(),
  /** 함께 쓰면 안 되는 조합 */
  avoid: z.string().optional(),
});
export type CombinationNotes = z.infer<typeof CombinationNotesSchema>;

// ─── AI 분석 결과 ─────────────────────────────────────────────────

export const AnalysisResultSchema = z.object({
  /** 추천 성분 목록 (3~5개) */
  ingredients: z.array(IngredientSchema).min(3).max(5),
  /** 성분 조합 가이드 (선택) */
  combinationNotes: CombinationNotesSchema.optional(),
  /** 전체 피부 분석 요약 */
  summary: z.string(),
  /** 면책 조항 */
  disclaimer: z.string(),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// ─── API 응답 형태 ────────────────────────────────────────────────

export type AnalyzeSuccessResponse = {
  success: true;
  data: AnalysisResult;
};

export type AnalyzeErrorResponse = {
  success: false;
  error: string;
};

export type AnalyzeApiResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;
