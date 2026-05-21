"use client";

import Link from "next/link";
import ProgressBar from "@/components/ui/ProgressBar";
import { useDiagnosisStore } from "@/store/diagnosisStore";

// ─── 뒤로가기 아이콘 ─────────────────────────────────────────────

function ArrowLeftIcon(): React.ReactElement {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────

interface DiagnosisShellProps {
  children: React.ReactNode;
}

const STEP_LABELS: Record<number, string> = {
  1: "기본 정보",
  2: "피부 타입",
  3: "피부 고민",
  4: "라이프스타일",
};

/**
 * 진단 플로우 공통 레이아웃.
 * - 상단: 뒤로가기 / 단계 표시
 * - 중단: ProgressBar
 * - 하단: children (각 스텝 컴포넌트)
 */
export default function DiagnosisShell({
  children,
}: DiagnosisShellProps): React.ReactElement {
  const { currentStep, goPrev } = useDiagnosisStore();
  const isFirstStep = currentStep === 1;

  return (
    <div className="min-h-screen bg-surface-page flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-surface-card border-b border-border-subtle">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* 뒤로가기 or 홈 링크 */}
          {isFirstStep ? (
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-text-muted hover:text-text-body transition-colors"
            >
              <ArrowLeftIcon />
              <span>홈으로</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={goPrev}
              className="flex items-center gap-1 text-sm text-text-muted hover:text-text-body transition-colors cursor-pointer"
            >
              <ArrowLeftIcon />
              <span>이전</span>
            </button>
          )}

          {/* 단계 레이블 */}
          <span className="text-sm font-medium text-text-body">
            {STEP_LABELS[currentStep]}
          </span>

          {/* 우측 여백 맞추기 */}
          <div className="w-14" aria-hidden="true" />
        </div>

        {/* 프로그레스 바 */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-3">
          <ProgressBar
            value={currentStep}
            max={4}
            showSteps
            currentStep={currentStep}
            totalSteps={4}
            label={`4단계 중 ${currentStep}단계`}
          />
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
