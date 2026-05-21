import { z } from "zod";

// ─── Step 1: 기본 정보 ────────────────────────────────────────────

// Zod v4: required_error → error
export const AgeRangeSchema = z.enum(
  ["teens", "twenties", "thirties", "forties", "fifties_plus"],
  { error: "나이대를 선택해주세요" }
);
export type AgeRange = z.infer<typeof AgeRangeSchema>;

export const GenderSchema = z.enum(
  ["female", "male", "prefer_not_to_say"],
  { error: "성별을 선택해주세요" }
);
export type Gender = z.infer<typeof GenderSchema>;

export const Step1Schema = z.object({
  ageRange: AgeRangeSchema,
  gender: GenderSchema,
});
export type Step1Data = z.infer<typeof Step1Schema>;

// ─── Step 2: 피부 타입 ───────────────────────────────────────────

export const SkinTypeSchema = z.enum(
  ["dry", "oily", "combination", "sensitive", "normal"],
  { error: "피부 타입을 선택해주세요" }
);
export type SkinType = z.infer<typeof SkinTypeSchema>;

export const Step2Schema = z.object({
  skinType: SkinTypeSchema,
});
export type Step2Data = z.infer<typeof Step2Schema>;

// ─── Step 3: 피부 고민 ───────────────────────────────────────────

export const SkinConcernSchema = z.enum([
  "acne",           // 트러블/여드름
  "whitening",      // 미백/칙칙함
  "anti_aging",     // 주름/탄력
  "hydration",      // 수분/건조함
  "pores",          // 모공
  "exfoliation",    // 각질
  "redness",        // 홍조/민감
  "dark_circles",   // 다크서클
]);
export type SkinConcern = z.infer<typeof SkinConcernSchema>;

export const Step3Schema = z.object({
  concerns: z
    .array(SkinConcernSchema)
    .min(1, "고민을 최소 1개 선택해주세요")
    .max(5, "고민은 최대 5개까지 선택할 수 있어요"),
});
export type Step3Data = z.infer<typeof Step3Schema>;

// ─── Step 4: 라이프스타일 ─────────────────────────────────────────

export const Step4Schema = z.object({
  useSunscreen: z.boolean().nullable(),
  isFragranceSensitive: z.boolean().nullable(),
  hasAllergies: z.boolean().nullable(),
  allergyDetails: z.string().max(200, "200자 이내로 입력해주세요").optional(),
});
export type Step4Data = z.infer<typeof Step4Schema>;

// ─── 전체 진단 폼 데이터 ─────────────────────────────────────────

export const DiagnosisFormSchema = Step1Schema.merge(Step2Schema)
  .merge(Step3Schema)
  .merge(Step4Schema);

export type DiagnosisFormData = z.infer<typeof DiagnosisFormSchema>;

// ─── 한국어 레이블 맵 ────────────────────────────────────────────

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  teens: "10대",
  twenties: "20대",
  thirties: "30대",
  forties: "40대",
  fifties_plus: "50대 이상",
};

export const GENDER_LABELS: Record<Gender, string> = {
  female: "여성",
  male: "남성",
  prefer_not_to_say: "선택 안 함",
};

export const SKIN_TYPE_LABELS: Record<SkinType, string> = {
  dry: "건성",
  oily: "지성",
  combination: "복합성",
  sensitive: "민감성",
  normal: "중성",
};

export const SKIN_TYPE_DESCRIPTIONS: Record<SkinType, string> = {
  dry: "당김, 건조함, 각질이 자주 생겨요",
  oily: "이마, 코, 턱에 유분이 많아요",
  combination: "T존은 기름지고 볼은 건조해요",
  sensitive: "자극에 쉽게 반응하고 홍조가 잘 생겨요",
  normal: "특별한 고민 없이 균형 잡힌 피부예요",
};

export const SKIN_CONCERN_LABELS: Record<SkinConcern, string> = {
  acne: "트러블 / 여드름",
  whitening: "미백 / 칙칙함",
  anti_aging: "주름 / 탄력",
  hydration: "수분 / 건조함",
  pores: "모공",
  exfoliation: "각질",
  redness: "홍조 / 민감",
  dark_circles: "다크서클",
};
