import { cn } from "@/lib/utils/cn";

// ─── 타입 ──────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 인풋 위에 표시할 레이블 */
  label?: string;
  /** 에러 메시지 (있으면 에러 스타일 적용) */
  error?: string;
  /** 보조 안내 텍스트 (에러가 없을 때만 표시) */
  hint?: string;
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────

/**
 * 공통 인풋 컴포넌트.
 * React Hook Form의 register() 결과를 스프레드해서 사용합니다.
 *
 * @example
 * // 기본 사용
 * <Input label="이름" placeholder="홍길동" />
 *
 * // React Hook Form 연동
 * const { register, formState: { errors } } = useForm<FormValues>()
 * <Input
 *   label="나이"
 *   {...register("age")}
 *   error={errors.age?.message}
 * />
 */
export default function Input({
  label,
  error,
  hint,
  id,
  className,
  disabled,
  ...props
}: InputProps): React.ReactElement {
  // id가 없을 때 label과 input을 연결할 fallback id 생성
  const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
  const hintId = inputId ? `${inputId}-hint` : undefined;
  const errorId = inputId ? `${inputId}-error` : undefined;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* 레이블 */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-body"
        >
          {label}
        </label>
      )}

      {/* 인풋 */}
      <input
        id={inputId}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? errorId : hint ? hintId : undefined
        }
        className={cn(
          // 레이아웃
          "w-full px-4 py-3 text-base",
          // 색상 / 배경
          "bg-surface-section text-text-body",
          "placeholder:text-text-muted",
          // 테두리
          "border rounded-lg",
          // 상태별 테두리
          hasError
            ? "border-error focus:border-error focus:ring-2 focus:ring-error-bg"
            : "border-border-default focus:border-primary-500 focus:ring-2 focus:ring-primary-100",
          // 공통 포커스
          "focus:outline-none",
          // 전환
          "transition-colors duration-150",
          // 비활성화
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />

      {/* 에러 / 힌트 메시지 */}
      {hasError ? (
        <p id={errorId} role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
