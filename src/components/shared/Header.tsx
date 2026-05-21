import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

// ─── 로고 아이콘 (잎 모양 SVG) ────────────────────────────────────

function LeafIcon(): React.ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2C8 2 4 5 4 10C4 15 8 20 12 22C16 20 20 15 20 10C20 5 16 2 12 2Z"
        fill="currentColor"
        className="text-primary-500"
        opacity="0.2"
      />
      <path
        d="M12 2C8 2 4 5 4 10C4 14 7 18 11 21L12 22C12 22 12 12 20 10C20 5 16 2 12 2Z"
        fill="currentColor"
        className="text-primary-500"
      />
    </svg>
  );
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────

/**
 * 사이트 공통 헤더.
 * 서버 컴포넌트 — 클라이언트 상태 없음.
 */
export default function Header(): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 bg-surface-card border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-text-heading hover:opacity-80 transition-opacity"
        >
          <LeafIcon />
          <span className="font-semibold text-lg tracking-tight">
            Skincare AI
          </span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav
          className="hidden sm:flex items-center gap-6"
          aria-label="주요 메뉴"
        >
          <Link
            href="/about"
            className="text-sm text-text-muted hover:text-text-body transition-colors"
          >
            서비스 소개
          </Link>
        </nav>

        {/* 진단 CTA */}
        <Link
          href="/diagnosis"
          className={buttonVariants({ variant: "primary", size: "sm" })}
        >
          진단 시작하기
        </Link>
      </div>
    </header>
  );
}
