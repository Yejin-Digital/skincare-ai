import { cn } from "@/lib/utils/cn";

// ─── 타입 ──────────────────────────────────────────────────────────

interface ProgressBarProps {
  /** 현재 진행 값 (0 ~ max) */
  value: number;
  /** 최대 값 (기본: 100) */
  max?: number;
  /** 스크린리더를 위한 레이블 */
  label?: string;
  /** 진단 플로우용: 스텝 표시 (예: "2 / 4") */
  showSteps?: boolean;
  /** 현재 스텝 (1-indexed) */
  currentStep?: number;
  /** 전체 스텝 수 */
  totalSteps?: number;
  /** 추가 클래스 (바 전체 래퍼에 적용) */
  className?: string;
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────

/**
 * 공통 진행률 바 컴포넌트.
 * 진단 플로우의 단계 표시에 주로 사용됩니다.
 *
 * @example
 * // 퍼센트 기반
 * <ProgressBar value={50} label="진단 진행 중" />
 *
 * // 진단 플로우 스텝 표시
 * <ProgressBar
 *   value={2}
 *   max={4}
 *   showSteps
 *   currentStep={2}
 *   totalSteps={4}
 *   label="4단계 중 2단계 완료"
 * />
 */
export default function ProgressBar({
  value,
  max = 100,
  label,
  showSteps = false,
  currentStep,
  totalSteps,
  className,
}: ProgressBarProps): React.ReactElement {
  // 0~100 사이로 클램핑
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const roundedPercentage = Math.round(percentage);

  return (
    <div className={cn("w-full", className)}>
      {/* 스텝 표시 헤더 */}
      {showSteps && currentStep != null && totalSteps != null && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-body">
            {currentStep}단계
          </span>
          <span className="text-xs text-text-muted">
            {currentStep} / {totalSteps}
          </span>
        </div>
      )}

      {/* 바 트랙 */}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? `진행률 ${roundedPercentage}%`}
        className="w-full h-2 bg-surface-section rounded-full overflow-hidden"
      >
        {/* 바 필 */}
        <div
          className={cn(
            "h-full bg-cta rounded-full",
            "transition-[width] duration-300 ease-out"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
