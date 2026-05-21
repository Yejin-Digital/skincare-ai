"use client";

import { useCurrentStep } from "@/store/diagnosisStore";
import DiagnosisShell from "@/components/diagnosis/DiagnosisShell";
import Step1BasicInfo from "@/components/diagnosis/Step1BasicInfo";
import Step2SkinType from "@/components/diagnosis/Step2SkinType";
import Step3Concerns from "@/components/diagnosis/Step3Concerns";
import Step4Lifestyle from "@/components/diagnosis/Step4Lifestyle";

// ─── 단계별 컴포넌트 맵 ─────────────────────────────────────────────

const STEP_COMPONENTS = {
  1: Step1BasicInfo,
  2: Step2SkinType,
  3: Step3Concerns,
  4: Step4Lifestyle,
} as const;

// ─── 페이지 ────────────────────────────────────────────────────────

/**
 * 진단 플로우 페이지.
 *
 * - 단일 URL(/diagnosis)에서 단계 전환 (URL 변경 없음)
 * - 단계 상태는 Zustand 스토어에서 관리
 * - 각 단계 컴포넌트는 완료 시 store에 데이터 저장 후 goNext() 호출
 * - Step4 완료 시 /results로 라우팅
 */
export default function DiagnosisPage(): React.ReactElement {
  const currentStep = useCurrentStep();
  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <DiagnosisShell>
      <StepComponent />
    </DiagnosisShell>
  );
}
