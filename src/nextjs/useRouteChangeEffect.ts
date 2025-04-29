import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * 라우트 변경이 감지될 때마다 주어진 effect를 실행하는 Hook
 *
 * @param effect - 라우트 변경 시 실행할 함수
 * @param options - 추가 설정 옵션
 * @param options.runOnMount - 컴포넌트 마운트 시에도 effect를 실행할지 여부 (기본값: false)
 *
 * @example
 * ```tsx
 * // 기본 사용
 * useRouteChangeEffect(() => {
 *   console.log("라우트가 변경되었습니다.");
 * });
 *
 * // 마운트 시에도 실행
 * useRouteChangeEffect(() => {
 *   console.log("라우트가 변경되었거나 컴포넌트가 마운트되었습니다.");
 * }, { runOnMount: true });
 * ```
 */
export function useRouteChangeEffect(
  effect: () => void,
  options: { runOnMount?: boolean } = {}
) {
  const pathname = usePathname();
  const { runOnMount = false } = options;
  const previousPathname = useRef<string>(pathname);

  useEffect(() => {
    if (
      (runOnMount && previousPathname.current === pathname) ||
      previousPathname.current !== pathname
    ) {
      effect();
    }
    previousPathname.current = pathname;
  }, [pathname, effect, runOnMount]);
}
