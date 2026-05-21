import { cn } from "@/lib/utils/cn";

// ─── 타입 ──────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 변형 (기본: primary) */
  variant?: ButtonVariant;
  /** 버튼 크기 (기본: md, 44px 이상 터치 타겟 보장) */
  size?: ButtonSize;
  /** 로딩 중 스피너 표시 및 비활성화 */
  isLoading?: boolean;
  /** 버튼 텍스트 앞에 표시할 아이콘 */
  leftIcon?: React.ReactNode;
  /** 버튼 텍스트 뒤에 표시할 아이콘 */
  rightIcon?: React.ReactNode;
}

// ─── 스타일 맵 ─────────────────────────────────────────────────────

/** 모든 버튼/링크에 공통으로 적용되는 기본 스타일 */
const BASE_STYLES =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 ease-in-out cursor-pointer";

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-cta text-text-inverse",
    "hover:bg-cta-hover",
    "active:bg-cta-active",
    "disabled:opacity-50 disabled:pointer-events-none",
  ].join(" "),

  secondary: [
    "bg-transparent border border-border-default text-text-body",
    "hover:bg-surface-section",
    "active:bg-surface-section",
    "disabled:opacity-50 disabled:pointer-events-none",
  ].join(" "),

  ghost: [
    "bg-transparent text-text-muted",
    "hover:bg-surface-section hover:text-text-body",
    "active:bg-surface-section",
    "disabled:opacity-50 disabled:pointer-events-none",
  ].join(" "),
};

// ─── 공개 헬퍼 ─────────────────────────────────────────────────────

/**
 * `<Link>` 등 button이 아닌 요소에 버튼 스타일을 적용할 때 사용합니다.
 *
 * @example
 * import Link from 'next/link'
 * import { buttonVariants } from '@/components/ui/Button'
 *
 * <Link href="/diagnosis" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
 *   진단 시작하기
 * </Link>
 */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(BASE_STYLES, variantStyles[variant], sizeStyles[size], className);
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm rounded-md",
  md: "h-11 px-6 text-base rounded-lg",   // 44px — WCAG 최소 터치 타겟
  lg: "h-14 px-8 text-lg rounded-xl",     // 56px — 주요 CTA
};

// ─── 내부 컴포넌트 ─────────────────────────────────────────────────

function Spinner(): React.ReactElement {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────

/**
 * 공통 버튼 컴포넌트.
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleSubmit}>
 *   진단 시작하기
 * </Button>
 *
 * <Button variant="secondary" leftIcon={<ArrowLeft />}>
 *   이전으로
 * </Button>
 */
export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps): React.ReactElement {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      aria-busy={isLoading}
      className={cn(
        BASE_STYLES,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
