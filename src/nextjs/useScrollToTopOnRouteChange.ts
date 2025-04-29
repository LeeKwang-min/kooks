import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface ScrollToTopOptions {
  /**
   * 스크롤 동작의 부드러움을 설정합니다.
   * @default "smooth"
   */
  behavior?: ScrollBehavior;
  /**
   * 스크롤 위치를 조정할 오프셋 값입니다.
   * @default 0
   */
  offset?: number;
}

/**
 * 라우트 변경 시 스크롤을 최상단으로 이동시키는 Hook
 *
 * @param options - 스크롤 동작 설정
 *
 * @example
 * ```tsx
 * // 기본 사용
 * useScrollToTopOnRouteChange();
 *
 * // 옵션 설정
 * useScrollToTopOnRouteChange({ behavior: "auto", offset: 20 });
 * ```
 */
export function useScrollToTopOnRouteChange(options: ScrollToTopOptions = {}) {
  const pathname = usePathname();
  const { behavior = "smooth", offset = 0 } = options;

  useEffect(() => {
    window.scrollTo({
      top: offset,
      behavior,
    });
  }, [pathname, behavior, offset]);
}
