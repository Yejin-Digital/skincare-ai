"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDiagnosisStore } from "@/store/diagnosisStore";
import {
  Step2Schema,
  type Step2Data,
  SKIN_TYPE_LABELS,
  SKIN_TYPE_DESCRIPTIONS,
  type SkinType,
} from "@/types/diagnosis";
import { cn } from "@/lib/utils/cn";
import Button from "@/components/ui/Button";

// ─── 피부 타입 카드 ────────────────────────────────────────────────

interface SkinTypeCardProps {
  value: SkinType;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function SkinTypeCard({
  label,
  description,
  selected,
  onClick,
}: SkinTypeCardProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-4 rounded-xl border-2",
        "transition-colors duration-150 cursor-pointer",
        selected
          ? "border-primary-500 bg-primary-50"
          : "border-border-default bg-surface-card hover:border-primary-300 hover:bg-primary-50"
      )}
    >
      <p
        className={cn(
          "text-sm font-semibold mb-1",
          selected ? "text-primary-700" : "text-text-heading"
        )}
      >
        {label}
      </p>
      <p className="text-xs text-text-muted leading-relaxed">{description}</p>
    </button>
  );
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────

export default function Step2SkinType(): React.ReactElement {
  const { step2, saveStep2, goNext } = useDiagnosisStore();

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(Step2Schema),
    defaultValues: step2 ?? undefined,
  });

  const selected = watch("skinType");

  const onSubmit = (data: Step2Data): void => {
    saveStep2(data);
    goNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold text-text-heading mb-2">
          피부 타입이 어떻게 되세요?
        </h1>
        <p className="text-text-muted">
          평소 세안 후 아무것도 바르지 않았을 때 느낌을 기준으로 선택해주세요.
        </p>
      </div>

      {/* 피부 타입 카드 목록 */}
      <fieldset>
        <legend className="sr-only">피부 타입 선택</legend>
        <div className="flex flex-col gap-3">
          {(
            Object.entries(SKIN_TYPE_LABELS) as [SkinType, string][]
          ).map(([value, label]) => (
            <SkinTypeCard
              key={value}
              value={value}
              label={label}
              description={SKIN_TYPE_DESCRIPTIONS[value]}
              selected={selected === value}
              onClick={() =>
                setValue("skinType", value, { shouldValidate: true })
              }
            />
          ))}
        </div>
        {errors.skinType && (
          <p role="alert" className="mt-2 text-xs text-error">
            {errors.skinType.message}
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
