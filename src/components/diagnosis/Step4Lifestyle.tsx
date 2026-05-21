"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDiagnosisStore } from "@/store/diagnosisStore";
import { Step4Schema, type Step4Data } from "@/types/diagnosis";
import { cn } from "@/lib/utils/cn";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// ─── Yes/No/Skip 토글 ──────────────────────────────────────────────

interface YesNoToggleProps {
  value: boolean | null;
  onChange: (v: boolean | null) => void;
  yesLabel?: string;
  noLabel?: string;
}

function YesNoToggle({
  value,
  onChange,
  yesLabel = "예",
  noLabel = "아니요",
}: YesNoToggleProps): React.ReactElement {
  return (
    <div className="flex gap-2">
      {([true, false] as const).map((option) => (
        <button
          key={String(option)}
          type="button"
          onClick={() =>
            onChange(value === option ? null : option)
          }
          className={cn(
            "flex-1 h-11 px-4 rounded-xl border-2 text-sm font-medium",
            "transition-colors duration-150 cursor-pointer",
            value === option
              ? "border-primary-500 bg-primary-50 text-primary-700"
              : "border-border-default bg-surface-card text-text-body hover:border-primary-300"
          )}
        >
          {option ? yesLabel : noLabel}
        </button>
      ))}
    </div>
  );
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────

export default function Step4Lifestyle(): React.ReactElement {
  const router = useRouter();
  const { step4, saveStep4 } = useDiagnosisStore();

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Step4Data>({
    resolver: zodResolver(Step4Schema),
    defaultValues: step4 ?? {
      useSunscreen: null,
      isFragranceSensitive: null,
      hasAllergies: null,
      allergyDetails: "",
    },
  });

  const hasAllergies = watch("hasAllergies");

  const onSubmit = async (data: Step4Data): Promise<void> => {
    saveStep4(data);
    // 진단 완료 → 결과 페이지로 이동
    router.push("/results");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold text-text-heading mb-2">
          라이프스타일을 알려주세요
        </h1>
        <p className="text-text-muted">
          선택 사항이에요. 더 정확한 추천을 위해 답해주시면 좋아요.
        </p>
      </div>

      {/* 선크림 사용 여부 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-text-body">
          평소 선케어 제품을 사용하시나요?
        </p>
        <YesNoToggle
          value={watch("useSunscreen")}
          onChange={(v) => setValue("useSunscreen", v)}
        />
      </div>

      {/* 향 민감도 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-text-body">
          향이 있는 제품에 민감하게 반응하시나요?
        </p>
        <YesNoToggle
          value={watch("isFragranceSensitive")}
          onChange={(v) => setValue("isFragranceSensitive", v)}
          yesLabel="예, 민감해요"
          noLabel="괜찮아요"
        />
      </div>

      {/* 알레르기 */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-text-body">
          특정 성분에 알레르기나 트러블 이력이 있으신가요?
        </p>
        <YesNoToggle
          value={hasAllergies}
          onChange={(v) => {
            setValue("hasAllergies", v);
            if (!v) setValue("allergyDetails", "");
          }}
        />

        {/* 알레르기 상세 (조건부) */}
        {hasAllergies === true && (
          <Input
            label="어떤 성분인지 알고 계시면 적어주세요"
            placeholder="예: 레티놀, 살리실산, 알코올..."
            {...register("allergyDetails")}
            error={errors.allergyDetails?.message}
            hint="모르셔도 괜찮아요"
          />
        )}
      </div>

      {/* 분석 시작 버튼 */}
      <div className="mt-auto pt-4 border-t border-border-subtle">
        <p className="text-xs text-text-muted mb-4 text-center">
          입력하신 정보는 AI 분석에만 사용되며 저장되지 않습니다.
        </p>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          {isSubmitting ? "분석 중..." : "AI 분석 시작하기"}
        </Button>
      </div>
    </form>
  );
}
