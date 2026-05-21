import Link from 'next/link';

/**
 * 사이트 공통 푸터.
 * Disclaimer는 MVP의 의료 오인 방지 필수 요소.
 */
export default function Footer(): React.ReactElement {
  return (
    <footer className="bg-surface-section border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* 브랜드 */}
          <div>
            <p className="text-sm font-semibold text-text-heading mb-1">
              Skincare AI
            </p>
            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              이 서비스는 AI 기반 성분 참고 정보를 제공합니다.
              <br />
              의료적 진단, 처방, 치료를 대체하지 않습니다.
            </p>
          </div>

          {/* 링크 */}
          <nav className="flex gap-6" aria-label="푸터 메뉴">
            <Link
              href="/about"
              className="text-xs text-text-muted hover:text-text-body transition-colors"
            >
              서비스 소개
            </Link>
          </nav>
        </div>

        {/* 저작권 */}
        <div className="mt-8 pt-6 border-t border-border-subtle">
          <p className="text-xs text-text-disabled">
            © 2026 Skincare AI | A portfolio project by Yejin Jang. Portfoilo |
            GitHub | Design Process
          </p>
        </div>
      </div>
    </footer>
  );
}
