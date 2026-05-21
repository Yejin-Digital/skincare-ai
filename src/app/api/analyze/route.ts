import Anthropic, {
  APIConnectionError,
  APIConnectionTimeoutError,
  AuthenticationError,
  RateLimitError,
  APIError,
} from "@anthropic-ai/sdk";
import { DiagnosisFormSchema } from "@/types/diagnosis";
import { AnalysisResultSchema, type AnalyzeApiResponse } from "@/types/analysis";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/ai/prompts/analyzePrompt";

// ─── Claude 클라이언트 (모듈 수준에서 한 번만 초기화) ──────────────

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── 헬퍼 ────────────────────────────────────────────────────────

function errorResponse(message: string, status: number): Response {
  const body: AnalyzeApiResponse = { success: false, error: message };
  return Response.json(body, { status });
}

/**
 * AI 응답 텍스트에서 JSON을 안전하게 추출합니다.
 * Claude가 간혹 코드 블록으로 감쌀 경우를 대비합니다.
 */
function extractJson(text: string): string {
  const trimmed = text.trim();
  // ```json ... ``` 형태 제거
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/);
  if (fenced) return fenced[1].trim();
  return trimmed;
}

// ─── POST /api/analyze ───────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  // 1. 요청 바디 파싱
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return errorResponse("요청 형식이 올바르지 않습니다.", 400);
  }

  // 2. 진단 데이터 유효성 검사
  const parseResult = DiagnosisFormSchema.safeParse(rawBody);
  if (!parseResult.success) {
    return errorResponse("진단 데이터가 올바르지 않습니다.", 400);
  }
  const diagnosisData = parseResult.data;

  // 3. Claude API 호출 (스트리밍으로 받고 최종 메시지 추출)
  let rawText: string;
  try {
    const stream = anthropic.messages.stream({
      model: "claude-opus-4-7",
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          // 프롬프트 캐싱: 시스템 프롬프트는 변경되지 않으므로 캐시
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: buildUserPrompt(diagnosisData),
        },
      ],
    });

    const finalMessage = await stream.finalMessage();

    // text 블록에서 내용 추출 (thinking 블록 제외)
    const textBlock = finalMessage.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return errorResponse("AI 응답 처리에 실패했습니다.", 500);
    }
    rawText = textBlock.text;
  } catch (err: unknown) {
    // 에러 타입별 클라이언트 메시지 분기 (내부 상세 정보 노출 금지)
    if (err instanceof AuthenticationError) {
      console.error("[analyze] Anthropic authentication failed");
      return errorResponse("서버 설정 오류가 발생했습니다.", 500);
    }
    if (err instanceof RateLimitError) {
      return errorResponse("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", 429);
    }
    if (
      err instanceof APIConnectionError ||
      err instanceof APIConnectionTimeoutError
    ) {
      return errorResponse("AI 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.", 503);
    }
    if (err instanceof APIError) {
      console.error("[analyze] Anthropic API error:", err.status);
      return errorResponse("AI 분석 중 오류가 발생했습니다.", 500);
    }
    console.error("[analyze] Unexpected error:", err);
    return errorResponse("알 수 없는 오류가 발생했습니다.", 500);
  }

  // 4. JSON 파싱 및 스키마 검증
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(rawText));
  } catch {
    console.error("[analyze] Failed to parse AI JSON response");
    return errorResponse("AI 응답을 처리할 수 없습니다.", 500);
  }

  const validationResult = AnalysisResultSchema.safeParse(parsed);
  if (!validationResult.success) {
    console.error("[analyze] AI response failed schema validation:", validationResult.error.issues);
    return errorResponse("AI 분석 결과가 올바르지 않습니다.", 500);
  }

  // 5. 성공 응답
  const body: AnalyzeApiResponse = {
    success: true,
    data: validationResult.data,
  };
  return Response.json(body, { status: 200 });
}
