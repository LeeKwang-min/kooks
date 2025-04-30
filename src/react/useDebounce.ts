import { useCallback, useRef } from "react";

/**
 * 콜백 함수를 지정한 시간 동안 호출되지 않을 때만 실행하는 Hook
 *
 * 이 훅은 연속된 함수 호출을 하나로 묶어 성능을 최적화합니다.
 * 예를 들어, 사용자 입력이나 검색 API 호출과 같이 연속적인 이벤트를 처리할 때 유용합니다.
 *
 * @param callback - 디바운스할 콜백 함수
 * @param delay - 실행을 지연할 시간(ms)
 *   - 0 이하: 경고 메시지 출력 후 즉시 실행
 *   - 양수: 지정된 시간 동안 호출이 없을 때만 실행
 *
 * @returns 디바운스된 함수. 이 함수는 원본 함수와 동일한 매개변수를 받지만,
 *         delay 시간 동안 호출이 없을 때만 실행됩니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * const handleSearch = useDebounce((searchTerm: string) => {
 *   // 검색 API 호출
 *   searchAPI(searchTerm);
 * }, 500);
 *
 * // 입력 필드
 * <input
 *   type="text"
 *   onChange={(e) => handleSearch(e.target.value)}
 * />
 * ```
 */
export function useDebounce<Args extends unknown[], Return>(
  callback: (...args: Args) => Return,
  delay: number
): (...args: Args) => void {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (...args: Args) => {
      if (delay <= 0) {
        console.warn("useDebounce: delay must be a positive number");
        callback(...args);
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
