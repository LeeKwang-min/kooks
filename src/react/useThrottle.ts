import { useCallback, useRef } from "react";

/**
 * 콜백 함수를 일정 시간 간격으로만 실행하는 Hook
 *
 * 이 훅은 함수가 너무 자주 호출되는 것을 방지하여 성능을 최적화합니다.
 * 예를 들어, 스크롤 이벤트나 리사이즈 이벤트와 같이 빠르게 연속으로 발생하는 이벤트를 처리할 때 유용합니다.
 *
 * @param callback - 스로틀링할 콜백 함수
 * @param limit - 실행을 허용할 시간 간격(ms)
 *   - 0 이하: 경고 메시지 출력 후 즉시 실행
 *   - 양수: 지정된 간격으로만 실행
 *
 * @returns 스로틀링된 함수. 이 함수는 원본 함수와 동일한 매개변수를 받지만,
 *         limit 시간 간격으로만 실행됩니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * const handleScroll = useThrottle(() => {
 *   // 스크롤 이벤트 처리
 *   console.log(window.scrollY);
 * }, 500);
 *
 * useEffect(() => {
 *   window.addEventListener("scroll", handleScroll);
 *   return () => window.removeEventListener("scroll", handleScroll);
 * }, [handleScroll]);
 * ```
 */
export function useThrottle<Args extends unknown[], Return>(
  callback: (...args: Args) => Return,
  limit: number
): (...args: Args) => Return | undefined {
  const lastRan = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (...args: Args) => {
      if (limit <= 0) {
        console.warn("useThrottle: limit must be a positive number");
        return callback(...args);
      }

      const now = Date.now();
      const timeSinceLastRun = now - lastRan.current;

      if (timeSinceLastRun >= limit) {
        // 마지막 실행 후 limit 시간이 지났으면 즉시 실행
        lastRan.current = now;
        return callback(...args);
      } else {
        // 아직 limit 시간이 지나지 않았으면 나머지 시간만큼 대기 후 실행
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastRan.current = Date.now();
          callback(...args);
        }, limit - timeSinceLastRun);
      }
    },
    [callback, limit]
  );
}
