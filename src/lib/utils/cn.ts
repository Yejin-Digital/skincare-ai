/**
 * 클래스 이름을 병합하는 유틸리티.
 * falsy 값(undefined, null, false)을 자동으로 제거하고 공백으로 연결합니다.
 *
 * 참고: tailwind-merge 없이 동작하므로 동일 카테고리 클래스(예: p-2 p-4)가
 * 충돌하지 않도록 호출 측에서 관리해야 합니다.
 */
export function cn(
  ...inputs: (string | undefined | null | false | 0)[]
): string {
  return inputs.filter(Boolean).join(" ").trim();
}
