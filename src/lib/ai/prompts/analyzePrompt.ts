import {
  AGE_RANGE_LABELS,
  GENDER_LABELS,
  SKIN_TYPE_LABELS,
  SKIN_CONCERN_LABELS,
  type DiagnosisFormData,
} from "@/types/diagnosis";

// ─── 시스템 프롬프트 (캐시 대상) ──────────────────────────────────
// 프롬프트 캐싱용: 변경되지 않는 부분을 캐시 브레이크포인트 앞에 위치

export const SYSTEM_PROMPT = `당신은 피부 과학 전문가이자 K-뷰티 성분 분석가입니다. 사용자의 피부 정보를 바탕으로 맞춤형 스킨케어 성분을 추천합니다.

## 응답 규칙
1. 반드시 순수한 JSON만 반환하세요. 마크다운 코드 블록(예: \`\`\`json) 없이, 추가 설명 텍스트 없이, 오직 JSON 객체만 반환하세요.
2. 아래 JSON 스키마를 정확히 따르세요.
3. 모든 텍스트는 한국어로 작성하세요 (englishName 제외).
4. ingredients는 3개에서 5개 사이로 추천하세요.
5. 사용자의 피부 타입·고민·라이프스타일을 종합적으로 고려하세요.
6. allergyDetails에 언급된 성분 또는 유사 성분은 절대 추천하지 마세요.
7. 의학적 진단·치료를 대체하지 않음을 disclaimer에 항상 명시하세요.
8. 근거 없는 과장된 효능 주장은 삼가세요.

## 반환할 JSON 스키마
\`\`\`
{
  "ingredients": [
    {
      "name": "한국어 성분명",
      "englishName": "English ingredient name",
      "effect": "주요 효능 (1~2문장)",
      "reason": "이 사용자의 피부 특성에 맞는 추천 이유 (1~2문장)",
      "caution": "주의사항 — 없으면 이 필드 자체를 생략",
      "usage": "권장 제형 또는 사용법 (1문장)"
    }
  ],
  "combinationNotes": {
    "synergy": "함께 쓰면 효과가 상승하는 성분 조합 설명 — 없으면 이 필드 생략",
    "avoid": "함께 쓰면 안 되는 조합 설명 — 없으면 이 필드 생략"
  },
  "summary": "전체 피부 분석 요약 및 스킨케어 방향 제안 (3~4문장)",
  "disclaimer": "이 분석은 AI가 생성한 정보이며 의학적 진단을 대체하지 않습니다. 피부 트러블이나 알레르기 반응 시 전문 피부과 상담을 권장합니다."
}
\`\`\`

combinationNotes 필드 자체는 관련 내용이 있을 때만 포함하세요.` as const;

// ─── 사용자 프롬프트 빌더 ──────────────────────────────────────────

/**
 * 진단 폼 데이터를 Claude에게 전달할 사용자 메시지로 변환합니다.
 */
export function buildUserPrompt(data: DiagnosisFormData): string {
  const concerns = data.concerns
    .map((c) => SKIN_CONCERN_LABELS[c])
    .join(", ");

  const lines: string[] = [
    "## 사용자 피부 정보",
    "",
    `- **나이대**: ${AGE_RANGE_LABELS[data.ageRange]}`,
    `- **성별**: ${GENDER_LABELS[data.gender]}`,
    `- **피부 타입**: ${SKIN_TYPE_LABELS[data.skinType]}`,
    `- **피부 고민**: ${concerns}`,
    "",
    "## 라이프스타일",
  ];

  if (data.useSunscreen !== null) {
    lines.push(
      `- **선케어 사용**: ${data.useSunscreen ? "예" : "아니요"}`
    );
  }

  if (data.isFragranceSensitive !== null) {
    lines.push(
      `- **향 민감도**: ${data.isFragranceSensitive ? "향 성분에 민감함" : "향 성분 무관"}`
    );
  }

  if (data.hasAllergies !== null) {
    if (data.hasAllergies && data.allergyDetails) {
      lines.push(`- **알레르기/트러블 이력**: ${data.allergyDetails}`);
    } else if (data.hasAllergies) {
      lines.push("- **알레르기/트러블 이력**: 있음 (성분 미기재)");
    } else {
      lines.push("- **알레르기/트러블 이력**: 없음");
    }
  }

  lines.push(
    "",
    "위 정보를 바탕으로 이 사용자에게 가장 적합한 스킨케어 성분을 분석하고, 지정된 JSON 형식으로 반환해주세요."
  );

  return lines.join("\n");
}
