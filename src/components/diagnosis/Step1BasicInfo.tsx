"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDiagnosisStore } from "@/store/diagnosisStore";
import {
  Step1Schema,
  type Step1Data,
  AGE_RANGE_LABELS,
  GENDER_LABELS,
  type AgeRange,
  type Gender,
} from "@/types/diagnosis";
import { cn } from "@/lib/utils/cn";
import Button from "@/components/ui/Button";

// ─── 선택 카드 ────────────────────────────────────────────────────

interface SelectCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function SelectCard({
  label,
  selected,
  onClick,
}: SelectCardProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full py-3 px-4 rounded-xl border-2 text-sm font-medium",
        "transition-colors duration-150 cursor-pointer",
        "min-h-11", // 44px 터치 타겟
        selected
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-border-default bg-surface-card text-text-body hover:border-primary-300 hover:bg-primary-50"
      )}
    >
      {label}
    </button>
  );
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────

export default function Step1BasicInfo(): React.ReactElement {
  const { step1, saveStep1, goNext } = useDiagnosisStore();

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(Step1Schema),
    defaultValues: step1 ?? undefined,
  });

  const selectedAge = watch("ageRange");
  const selectedGender = watch("gender");

  const onSubmit = (data: Step1Data): void => {
    saveStep1(data);
    goNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold text-text-heading mb-2">
          기본 정보를 알려주세요
        </h1>
        <p className="text-text-muted">
          피부 상태는 나이에 따라 달라지기도 해요.
        </p>
      </div>

      {/* 나이대 */}
      <fieldset>
        <legend className="text-sm font-semibold text-text-body mb-3">
          나이대 <span className="text-error">*</span>
        </legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {(Object.entries(AGE_RANGE_LABELS) as [AgeRange, string][]).map(
            ([value, label]) => (
              <SelectCard
                key={value}
                label={label}
                selected={selectedAge === value}
                onClick={() => setValue("ageRange", value, { shouldValidate: true })}
              />
            )
          )}
        </div>
        {errors.ageRange && (
          <p role="alert" className="mt-2 text-xs text-error">
            {errors.ageRange.message}
          </p>
        )}
      </fieldset>

      {/* 성별 */}
      <fieldset>
        <legend className="text-sm font-semibold text-text-body mb-3">
          성별 <span className="text-error">*</span>
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(GENDER_LABELS) as [Gender, string][]).map(
            ([value, label]) => (
              <SelectCard
                key={value}
                label={label}
                selected={selectedGender === value}
                onClick={() => setValue("gender", value, { shouldValidate: true })}
              />
            )
          )}
        </div>
        {errors.gender && (
          <p role="alert" className="mt-2 text-xs text-error">
            {errors.gender.message}
          </p>
        )}
      </fieldset>

      {/* 다음 버튼 */}
      <Button type="submit" size="lg" className="w-full mt-auto">
        다음
      </Button>
    </form>
  );
}
