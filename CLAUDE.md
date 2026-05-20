# CLAUDE.md

> 이 문서는 Claude Code가 이 프로젝트에서 작업할 때 따라야 할 규칙입니다.
> 새 세션을 시작할 때마다 이 파일이 자동으로 읽힙니다.
> 프로젝트 배경은 `PROJECT_BRIEF.md`를 참고하세요.

---

## Project Overview

**이름:** Skincare AI
**목적:** 사용자의 피부 조건을 입력받아 AI가 분석한 성분과 제품을 추천하는 웹 서비스
**상태:** MVP 개발 중
**상세 배경:** `PROJECT_BRIEF.md` 참고

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Forms | React Hook Form + Zod |
| AI | Anthropic Claude API (claude-sonnet-4-5) |
| Deployment | Vercel |

---

## Code Style Rules

### TypeScript
- `any` 타입 절대 사용 금지. 모르면 `unknown`을 쓰고 좁혀 사용
- 모든 함수에 반환 타입 명시
- 타입 정의는 `src/types/`에 도메인별로 분리

### React
- 함수형 컴포넌트만 사용
- 컴포넌트 파일명은 PascalCase (`ProductCard.tsx`)
- 유틸 파일명은 camelCase (`formatPrice.ts`)
- props는 명시적 타입 인터페이스로 정의 (`interface ProductCardProps { ... }`)
- 클라이언트 컴포넌트에만 `"use client"` 명시, 기본은 서버 컴포넌트

### Styling
- 인라인 스타일 금지, 모든 스타일은 Tailwind 클래스로
- 색상은 직접 hex 값 쓰지 말고 `tailwind.config.ts`에 등록된 토큰만 사용
- 반응형은 항상 mobile-first (`sm:`, `md:`, `lg:` 순서)
- `globals.css`의 CSS 변수를 통해 다크모드 자동 지원

### File Organization
```
src/
├── app/              # 페이지 + API routes
├── components/
│   ├── ui/           # shadcn 기본 컴포넌트 (수정 가능)
│   ├── diagnosis/    # 진단 플로우 전용
│   ├── results/      # 결과 페이지 전용
│   └── shared/       # 여러 페이지에서 공통
├── lib/
│   ├── ai/           # Claude API 호출 로직
│   ├── data/         # 데이터 fetch/변환
│   └── utils/        # 순수 함수
├── store/            # Zustand 스토어
├── types/            # 도메인별 타입 정의
└── data/             # 시드 JSON 데이터
```

---

## Design System Rules

### 디자인 토큰 우선
새로운 색/간격/폰트가 필요하면 컴포넌트에서 바로 쓰지 말고
**먼저 `tailwind.config.ts`에 토큰으로 등록**한 뒤 사용한다.

### 반응형 Breakpoints
- Mobile: ~640px (기본)
- Tablet: 640~1024px (`sm`, `md`)
- Desktop: 1024px+ (`lg`, `xl`)

### 터치 타겟
인터랙티브 요소는 최소 44x44pt 확보 (모바일 접근성).

### 색상 사용 원칙
- Primary: 한 가지 액센트 컬러로 모든 CTA 통일
- Semantic: success/warning/error는 의미 기반으로만 사용
- Neutral: 텍스트와 배경은 neutral 스케일에서만 선택

---

## AI Integration Rules

### 호출 위치
- AI 호출은 **반드시** Next.js API Route(`src/app/api/`)에서만
- 클라이언트 코드에 API 키 노출 절대 금지
- `.env.local`에 `ANTHROPIC_API_KEY` 보관, `.gitignore` 확인

### 프롬프트 설계
- 시스템 프롬프트는 `src/lib/ai/prompts/`에 파일로 분리
- AI 응답은 **항상 JSON 구조**로 받아서 타입 검증 후 사용
- Zod 스키마로 응답 검증, 실패 시 안전한 폴백 제공

### 응답 표시 원칙
- AI가 추천한 내용에는 **항상 근거 표시** ("이 성분이 추천된 이유")
- AI 응답임을 사용자에게 명확히 알림 (오해 방지)
- 의료적 진단/처방으로 오인되지 않게 disclaimer 표시

---

## Security & Privacy

- 사용자 입력 데이터는 서버에 영구 저장하지 않음 (MVP)
- 진단 결과는 클라이언트 상태로만 유지
- 외부 API 호출 시 사용자 IP 등 식별 정보 전달 금지
- 에러 메시지에 내부 경로/스택 노출 금지

---

## Working Style with Claude Code

### 작업 시작 전
1. 작업을 시작하기 전, **이 파일과 PROJECT_BRIEF.md를 먼저 확인**
2. 큰 변경 전에는 계획을 먼저 제시하고 사용자 확인 받기
3. 기존 파일을 수정할 때는 먼저 read 한 뒤 수정

### 코드 작성 시
- 한 번에 한 가지 일에 집중 (대규모 변경 지양)
- 새 라이브러리 추가 시 사용자에게 먼저 알리기
- 주석은 "왜"를 설명할 때만 (무엇/어떻게는 코드로 충분)
- 작성 후 타입 에러 확인

### 절대 하지 말 것
- `npm install`을 사용자 허락 없이 실행 금지
- `.env.local` 파일을 git에 커밋하지 않도록 주의
- 기존 디자인 토큰 무시하고 임의 색상 사용 금지
- 진단 결과 UI를 의료 처방처럼 보이게 디자인 금지

---

## Current Priorities

작업 우선순위 (위에서부터):

1. 디자인 토큰 정의 (`tailwind.config.ts`, `globals.css`)
2. 공통 UI 컴포넌트 (Button, Card, Input, ProgressBar)
3. 랜딩 페이지
4. 진단 플로우 (Zustand 스토어 + 4단계 폼)
5. AI API Route + 프롬프트
6. Results 페이지 (핵심)
7. Product Detail 페이지
8. About 페이지
9. 배포 + 최적화

---

## Notes

- 시드 데이터는 `src/data/products.json`, `src/data/ingredients.json`에 저장
- 실제 화장품 데이터는 약 50~100개로 충분 (MVP)
- 제품 이미지는 placeholder 또는 일러스트 사용 (저작권 이슈 회피)
