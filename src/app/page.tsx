import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Card from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";

// ─── 섹션 데이터 ────────────────────────────────────────────────────

const PAIN_POINTS = [
  {
    id: 1,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "성분표, 봐도 모르겠어요",
    description:
      "나이아신아마이드, 레티놀, 세라마이드… 들어봤지만 내 피부에 맞는지 알 수가 없어요.",
  },
  {
    id: 2,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "리뷰 읽다 1시간이 사라져요",
    description:
      "리뷰는 넘쳐나는데 내 피부 타입에 맞는 건지, 뭘 믿어야 할지 점점 모르겠어요.",
  },
  {
    id: 3,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "광고 믿다가 또 실패했어요",
    description:
      "인플루언서 추천 제품 샀다가 피부 트러블만 났어요. 내 피부에 맞는 제품이 따로 있을 텐데.",
  },
  {
    id: 4,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "이 조합, 같이 써도 될까요?",
    description:
      "레티놀이랑 비타민C를 같이 쓰면 안 된다는 말을 들었는데, 내가 쓰는 제품은 괜찮은 걸까요?",
  },
] as const;

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "피부 진단",
    description:
      "나이대, 피부 타입, 주요 고민, 라이프스타일까지 4단계로 입력해요.",
    detail: "소요 시간: 약 3분",
  },
  {
    number: "02",
    title: "AI 분석",
    description:
      "Claude AI가 입력된 조건을 바탕으로 최적의 성분과 그 이유를 분석해요.",
    detail: "분석 근거와 함께 제공",
  },
  {
    number: "03",
    title: "제품 확인",
    description:
      "추천 성분이 담긴 실제 제품과 가격, 구매처를 한눈에 볼 수 있어요.",
    detail: "성분 조합 안전성도 확인",
  },
] as const;

const FEATURES = [
  {
    id: 1,
    title: "성분 → 제품 순서",
    description:
      "기존 앱과 반대로, 내 피부에 맞는 성분을 먼저 파악하고 그 성분이 담긴 제품을 찾아요.",
    badge: "차별점",
  },
  {
    id: 2,
    title: "AI 분석 근거 제공",
    description:
      "\"왜 이 성분이 나에게 맞나요?\"에 명확히 답해드려요. 신뢰할 수 있는 근거와 함께요.",
    badge: "신뢰성",
  },
  {
    id: 3,
    title: "성분 조합 안전성 확인",
    description:
      "여러 제품을 함께 쓸 때 주의할 성분 조합까지 알려드려요. 루틴 설계도 도와드립니다.",
    badge: "안전성",
  },
] as const;

// ─── 히어로 일러스트레이션 (CSS 기하학 도형) ───────────────────────

function HeroIllustration(): React.ReactElement {
  return (
    <div
      className="relative w-64 h-64 md:w-80 md:h-80 shrink-0"
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-primary-50" />
      <div className="absolute top-6 right-0 w-52 h-52 rounded-full bg-primary-100" />
      <div className="absolute bottom-6 left-4 w-28 h-28 rounded-full bg-primary-200" />
      <div className="absolute top-10 left-10 w-10 h-10 rounded-full bg-primary-400 opacity-40" />
      <div className="absolute bottom-14 right-10 w-6 h-6 rounded-full bg-primary-500 opacity-50" />
      <div className="absolute top-1/2 right-4 w-4 h-4 rounded-full bg-primary-300 opacity-60" />
    </div>
  );
}

// ─── 섹션: 히어로 ──────────────────────────────────────────────────

function HeroSection(): React.ReactElement {
  return (
    <section className="bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* 텍스트 영역 */}
          <div className="flex-1 text-center lg:text-left">
            {/* 태그 칩 */}
            <span className="inline-block px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-full mb-6">
              AI 기반 스킨케어 성분 분석
            </span>

            {/* 헤드라인 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-heading leading-tight tracking-tight mb-6">
              내 피부 고민,{" "}
              <br className="hidden sm:block" />
              <span className="text-primary-500">성분</span>으로
              <br className="hidden sm:block" />
              해결하세요
            </h1>

            {/* 서브 설명 */}
            <p className="text-lg text-text-muted leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              피부 타입과 고민을 입력하면 AI가 맞춤 성분과
              실제 구매 가능한 제품을 한번에 보여드립니다.
            </p>

            {/* CTA 그룹 */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link
                href="/diagnosis"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                지금 진단하기
              </Link>
              <span className="text-sm text-text-muted">
                ⏱ 소요 시간: 약 3분
              </span>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-text-disabled max-w-sm mx-auto lg:mx-0">
              이 서비스는 의료적 진단이나 처방을 제공하지 않습니다.
              AI 기반 성분 참고 정보입니다.
            </p>
          </div>

          {/* 일러스트레이션 (데스크탑만) */}
          <div className="hidden lg:block">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션: 공통 고민 ────────────────────────────────────────────────

function PainPointsSection(): React.ReactElement {
  return (
    <section className="bg-surface-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-heading mb-4">
            이런 고민, 혼자 하셨나요?
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            스킨케어 제품 고를 때 누구나 한 번쯤 겪는 어려움이에요.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 gap-4">
          {PAIN_POINTS.map((point) => (
            <li key={point.id}>
              <Card padding="md" className="h-full">
                <div className="flex gap-4">
                  <span className="text-primary-500 shrink-0 mt-0.5">
                    {point.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text-heading mb-1">
                      {point.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── 섹션: 이용 방법 ────────────────────────────────────────────────

function HowItWorksSection(): React.ReactElement {
  return (
    <section className="bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-heading mb-4">
            딱 3단계면 충분합니다
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            복잡한 가입 없이 바로 시작할 수 있어요.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-6 md:gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <li key={step.number} className="relative">
              {/* 스텝 연결선 (데스크탑) */}
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-8 left-[calc(100%_+_0.5rem)] w-6 h-px bg-border-default z-10"
                  aria-hidden="true"
                />
              )}
              <Card padding="md" className="h-full">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-primary-600">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-text-heading mb-2">
                  {step.title}
                </h3>
                <p className="text-text-muted leading-relaxed mb-3">
                  {step.description}
                </p>
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                  {step.detail}
                </span>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── 섹션: 차별점 ──────────────────────────────────────────────────

function FeaturesSection(): React.ReactElement {
  return (
    <section className="bg-surface-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-heading mb-4">
            기존 앱과 다른 점
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            화해, 글로우픽과 같은 방향이 아닌, 반대 방향으로 접근합니다.
          </p>
        </div>

        <ul className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <li key={feature.id}>
              <Card padding="md" className="h-full">
                <span className="inline-block px-2 py-0.5 text-xs font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-full mb-4">
                  {feature.badge}
                </span>
                <div className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-primary-500 shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.1" />
                    <path
                      d="M6 10l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-text-heading mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── 섹션: 하단 CTA ─────────────────────────────────────────────────

function CtaSection(): React.ReactElement {
  return (
    <section className="bg-primary-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          지금 바로 시작해보세요
        </h2>
        <p className="text-primary-100 text-lg mb-8 max-w-md mx-auto">
          가입 없이 3분이면 내 피부에 맞는 성분과 제품을 확인할 수 있어요.
        </p>
        <Link
          href="/diagnosis"
          className={buttonVariants({
            variant: "secondary",
            size: "lg",
            className:
              "border-white text-white hover:bg-white hover:text-primary-700",
          })}
        >
          무료로 진단받기
        </Link>
      </div>
    </section>
  );
}

// ─── 랜딩 페이지 ────────────────────────────────────────────────────

export default function LandingPage(): React.ReactElement {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PainPointsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
