"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDiagnosisStore } from "@/store/diagnosisStore";
import {
  Step3Schema,
  type Step3Data,
  SKIN_CONCERN_LABELS,
  type SkinConcern,
} from "@/types/diagnosis";
import { cn } from "@/lib/utils/cn";
import Button from "@/components/ui/Button";

// ─── 멀티 선택 칩 ────────────────────────────────────────────────

interface ConcernChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function ConcernChip({
  label,
  selected,
  onClick,
}: ConcernChipProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium",
        "transition-colors duration-150 cursor-pointer min-h-11",
        selected
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-border-default bg-surface-card text-text-body hover:border-primary-300 hover:bg-primary-50"
      )}
    >
      {/* 체크 인디케이터 */}
      <span
        className={cn(
          "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
          selected
            ? "bg-primary-500 border-primary-500"
            : "border-border-strong"
        )}
        aria-hidden="true"
      >
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4l2.5 2.5L9 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────

const ALL_CONCERNS = Object.entries(SKIN_CONCERN_LABELS) as [
  SkinConcern,
  string,
][];

export default function Step3Concerns(): React.ReactElement {
  const { step3, saveStep3, goNext } = useDiagnosisStore();

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(Step3Schema),
    defaultValues: step3 ?? { concerns: [] },
  });

  const selectedConcerns = watch("concerns") ?? [];

  const toggleConcern = (concern: SkinConcern): void => {
    const current = selectedConcerns;
    const next = current.includes(concern)
      ? current.filter((c) => c !== concern)
      : [...current, concern];
    setValue("concerns", next, { shouldValidate: true });
  };

  const onSubmit = (data: Step3Data): void => {
    saveStep3(data);
    goNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold text-text-heading mb-2">
          피부 고민을 선택해주세요
        </h1>
        <p className="text-text-muted">
          해당하는 항목을 모두 선택해주세요.{" "}
          <span className="font-medium text-text-body">최대 5개</span>까지
          고를 수 있어요.
        </p>
      </div>

      {/* 선택 칩 그리드 */}
      <fieldset>
        <legend className="sr-only">피부 고민 선택 (복수 선택 가능)</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
          {ALL_CONCERNS.map(([value, label]) => (
            <ConcernChip
              key={value}
              label={label}
              selected={selectedConcerns.includes(value)}
              onClick={() => toggleConcern(value)}
            />
          ))}
        </div>

        {/* 선택 개수 표시 */}
        <p
          className={cn(
            "mt-3 text-xs",
            selectedConcerns.length >= 5
              ? "text-warning font-medium"
              : "text-text-muted"
          )}
        >
          {selectedConcerns.length}개 선택됨
          {selectedConcerns.length >= 5 && " (최대)"}
        </p>

        {errors.concerns && (
          <p role="alert" className="mt-1 text-xs text-error">
            {errors.concerns.message}
          </p>
        )}
      </fieldset>

      {/* 다음 버튼 */}
      <Button type="submit" size="lg" className="w-full">
        다음
      </Button>
    </form>
  );
}
