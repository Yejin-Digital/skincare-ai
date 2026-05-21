"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDiagnosisStore } from "@/store/diagnosisStore";
import { DiagnosisFormSchema } from "@/types/diagnosis";
import type { AnalysisResult, AnalyzeApiResponse } from "@/types/analysis";
import type { Product } from "@/types/product";
import { getProductsByIngredients } from "@/lib/data/products";
import { buttonVariants } from "@/components/ui/Button";
import Button from "@/components/ui/Button";
import IngredientCard from "@/components/results/IngredientCard";
import ProductCard from "@/components/results/ProductCard";
import ResultsSkeleton from "@/components/results/ResultsSkeleton";
import { cn } from "@/lib/utils/cn";

// ─── 헬퍼 아이콘 ──────────────────────────────────────────────────

function ArrowLeftIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeafIcon(): React.ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
        fill="currentColor"
        opacity="0"
      />
      <path
        d="M17 8C17 8 12 3 7 8c0 0-2 5 3 8 0 0 2-4 7-8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M10 16c0-3 3-8 7-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SynergyIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="5" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function AvoidIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ─── 상태 타입 ────────────────────────────────────────────────────

type PageStatus = "loading" | "success" | "error";

// ─── 서브 섹션들 (서버 컴포넌트처럼 props만 받음) ─────────────────

interface SummarySectionProps {
  summary: string;
}
function SummarySection({ summary }: SummarySectionProps): React.ReactElement {
  return (
    <section aria-labelledby="summary-heading">
      <div className="bg-surface-card border border-border-subtle rounded-2xl px-6 py-5 shadow-sm">
        <h2
          id="summary-heading"
          className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3"
        >
          AI 피부 분석 요약
        </h2>
        <p className="text-base text-text-body leading-relaxed whitespace-pre-line">
          {summary}
        </p>
      </div>
    </section>
  );
}

interface CombinationNotesSectionProps {
  synergy?: string;
  avoid?: string;
}
function CombinationNotesSection({
  synergy,
  avoid,
}: CombinationNotesSectionProps): React.ReactElement | null {
  if (!synergy && !avoid) return null;

  return (
    <section aria-labelledby="combo-heading">
      <h2
        id="combo-heading"
        className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3"
      >
        성분 조합 가이드
      </h2>

      <div className="flex flex-col gap-3">
        {synergy && (
          <div className="bg-surface-card border border-border-subtle rounded-xl px-5 py-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary-700 mb-2">
              <SynergyIcon />
              함께 쓰면 좋아요
            </p>
            <p className="text-sm text-text-body leading-relaxed">{synergy}</p>
          </div>
        )}

        {avoid && (
          <div className="bg-surface-card border border-border-subtle rounded-xl px-5 py-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-warning mb-2">
              <AvoidIcon />
              함께 쓰지 마세요
            </p>
            <p className="text-sm text-text-body leading-relaxed">{avoid}</p>
          </div>
        )}
      </div>
    </section>
  );
}

interface DisclaimerProps {
  text: string;
}
function DisclaimerSection({ text }: DisclaimerProps): React.ReactElement {
  return (
    <footer className="mt-2 mb-8">
      <p className="text-xs text-text-muted text-center leading-relaxed px-4">
        {text}
      </p>
    </footer>
  );
}

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}
function ErrorView({ message, onRetry }: ErrorViewProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
        <span className="text-2xl" role="img" aria-label="오류">⚠️</span>
      </div>
      <div>
        <p className="text-base font-semibold text-text-heading mb-1">
          분석에 실패했어요
        </p>
        <p className="text-sm text-text-muted">{message}</p>
      </div>
      <Button variant="primary" size="md" onClick={onRetry}>
        다시 시도하기
      </Button>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────

export default function ResultsPage(): React.ReactElement {
  const router = useRouter();
  const { step1, step2, step3, step4, reset } = useDiagnosisStore();

  const [status, setStatus] = useState<PageStatus>("loading");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const runAnalysis = useCallback(async (): Promise<void> => {
    // 진단 데이터 합치기 + 유효성 검사
    const rawData = { ...step1, ...step2, ...step3, ...step4 };
    const parseResult = DiagnosisFormSchema.safeParse(rawData);

    if (!parseResult.success) {
      // 진단을 완료하지 않은 채로 직접 접근한 경우
      router.replace("/diagnosis");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parseResult.data),
      });

      if (!res.ok && res.status !== 429 && res.status !== 503) {
        const json = (await res.json()) as AnalyzeApiResponse;
        setErrorMessage(!json.success ? json.error : "알 수 없는 오류가 발생했습니다.");
        setStatus("error");
        return;
      }

      const json = (await res.json()) as AnalyzeApiResponse;

      if (json.success) {
        setResult(json.data);
        // 추천 성분 englishName 기반으로 관련 제품 매칭
        const ingredientNames = json.data.ingredients.map((i) => i.englishName);
        setMatchedProducts(getProductsByIngredients(ingredientNames));
        setStatus("success");
      } else {
        setErrorMessage(json.error);
        setStatus("error");
      }
    } catch {
      setErrorMessage("네트워크 연결을 확인하고 다시 시도해주세요.");
      setStatus("error");
    }
  }, [step1, step2, step3, step4, router]);

  useEffect(() => {
    runAnalysis();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRestart = (): void => {
    reset();
    router.push("/diagnosis");
  };

  return (
    <div className="min-h-screen bg-surface-page flex flex-col">
      {/* ── 상단 네비게이션 바 ── */}
      <header className="sticky top-0 z-10 bg-surface-page/80 backdrop-blur-sm border-b border-border-subtle">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-2 text-primary-600">
            <LeafIcon />
            <span className="text-sm font-semibold text-text-heading">
              Skincare AI
            </span>
          </div>

          {/* 다시 시작 버튼 */}
          <button
            type="button"
            onClick={handleRestart}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-xs"
            )}
          >
            <ArrowLeftIcon />
            다시 진단하기
          </button>
        </div>
      </header>

      {/* ── 본문 ── */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {status === "loading" && <ResultsSkeleton />}

        {status === "error" && (
          <ErrorView message={errorMessage} onRetry={runAnalysis} />
        )}

        {status === "success" && result && (
          <div className="flex flex-col gap-6">
            {/* 페이지 타이틀 */}
            <div>
              <h1 className="text-2xl font-bold text-text-heading mb-1">
                맞춤 성분 분석 결과
              </h1>
              <p className="text-sm text-text-muted">
                AI가 분석한 당신의 피부에 꼭 맞는 성분이에요.
              </p>
            </div>

            {/* 요약 */}
            <SummarySection summary={result.summary} />

            {/* 성분 카드 목록 */}
            <section aria-labelledby="ingredients-heading">
              <h2
                id="ingredients-heading"
                className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3"
              >
                추천 성분 {result.ingredients.length}가지
              </h2>
              <div className="flex flex-col gap-4">
                {result.ingredients.map((ingredient, idx) => (
                  <IngredientCard
                    key={ingredient.englishName}
                    ingredient={ingredient}
                    index={idx + 1}
                  />
                ))}
              </div>
            </section>

            {/* 성분 조합 가이드 (선택적) */}
            {result.combinationNotes && (
              <CombinationNotesSection
                synergy={result.combinationNotes.synergy}
                avoid={result.combinationNotes.avoid}
              />
            )}

            {/* 추천 제품 */}
            {matchedProducts.length > 0 && (
              <section aria-labelledby="products-heading">
                <h2
                  id="products-heading"
                  className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3"
                >
                  추천 성분이 담긴 제품
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {matchedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* 다시 진단하기 CTA */}
            <div className="border-t border-border-subtle pt-6">
              <button
                type="button"
                onClick={handleRestart}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "w-full"
                )}
              >
                처음부터 다시 진단하기
              </button>
              <p className="mt-3 text-xs text-text-muted text-center">
                피부 상태는 계절·나이에 따라 변할 수 있어요.
              </p>
            </div>

            {/* 면책 조항 */}
            <DisclaimerSection text={result.disclaimer} />
          </div>
        )}
      </main>
    </div>
  );
}
