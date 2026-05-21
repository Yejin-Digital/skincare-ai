"use client";

import { create } from "zustand";
import type {
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
} from "@/types/diagnosis";

// ─── 타입 ──────────────────────────────────────────────────────────

export type DiagnosisStep = 1 | 2 | 3 | 4;

/**
 * 각 단계 데이터를 Partial로 보관.
 * 단계 완료 시점에 해당 필드가 채워짐.
 */
export interface DiagnosisState {
  currentStep: DiagnosisStep;
  step1: Step1Data | null;
  step2: Step2Data | null;
  step3: Step3Data | null;
  step4: Step4Data | null;

  // 액션
  setStep: (step: DiagnosisStep) => void;
  saveStep1: (data: Step1Data) => void;
  saveStep2: (data: Step2Data) => void;
  saveStep3: (data: Step3Data) => void;
  saveStep4: (data: Step4Data) => void;
  goNext: () => void;
  goPrev: () => void;
  reset: () => void;
}

// ─── 초기 상태 ──────────────────────────────────────────────────────

const INITIAL_STATE = {
  currentStep: 1 as DiagnosisStep,
  step1: null,
  step2: null,
  step3: null,
  step4: null,
} as const;

// ─── 스토어 ────────────────────────────────────────────────────────

export const useDiagnosisStore = create<DiagnosisState>((set, get) => ({
  ...INITIAL_STATE,

  setStep: (step) => set({ currentStep: step }),

  saveStep1: (data) => set({ step1: data }),
  saveStep2: (data) => set({ step2: data }),
  saveStep3: (data) => set({ step3: data }),
  saveStep4: (data) => set({ step4: data }),

  goNext: () => {
    const { currentStep } = get();
    if (currentStep < 4) {
      set({ currentStep: (currentStep + 1) as DiagnosisStep });
    }
  },

  goPrev: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as DiagnosisStep });
    }
  },

  reset: () => set(INITIAL_STATE),
}));

// ─── 셀렉터 (불필요한 리렌더 방지) ─────────────────────────────────

/** 현재 단계만 구독 */
export const useCurrentStep = (): DiagnosisStep =>
  useDiagnosisStore((s) => s.currentStep);

/** 모든 단계 데이터를 하나의 객체로 합쳐 반환 */
export const useAllStepData = () =>
  useDiagnosisStore((s) => ({
    ...s.step1,
    ...s.step2,
    ...s.step3,
    ...s.step4,
  }));
