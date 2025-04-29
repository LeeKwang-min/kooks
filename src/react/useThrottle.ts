import { useEffect, useRef, useState } from "react";

/**
 * 빠르게 변경되는 값을 일정 시간 간격으로만 업데이트하는 Hook
 *
 * @param value - 스로틀링할 값
 * @param limit - 업데이트를 허용할 시간 간격(ms)
 *   - 0 이하: 경고 메시지 출력 후 100ms로 설정
 *   - 양수: 지정된 간격으로 업데이트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * const [value, setValue] = useState("");
 * const throttledValue = useThrottle(value, 500);
 *
 * // 스크롤 이벤트 스로틀링
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 100);
 *
 * useEffect(() => {
 *   const handleScroll = () => setScrollY(window.scrollY);
 *   window.addEventListener("scroll", handleScroll);
 *   return () => window.removeEventListener("scroll", handleScroll);
 * }, []);
 * ```
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  // limit이 0 이하일 경우 경고 메시지 출력
  useEffect(() => {
    if (limit <= 0) {
      console.warn("useThrottle: limit must be a positive number");
    }
  }, [limit]);

  return throttledValue;
}
