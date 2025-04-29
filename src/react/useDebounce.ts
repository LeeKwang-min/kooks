import { useEffect, useState } from "react";

/**
 * 입력값을 지정한 시간 동안 변경되지 않을 때만 업데이트하는 Hook
 *
 * @param value - 디바운스할 입력값
 * @param delay - 업데이트를 지연할 시간(ms)
 *   - 0 이하: 경고 메시지 출력 후 100ms로 설정
 *   - 양수: 지정된 시간 동안 변경이 없을 때 업데이트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * // 검색 API 호출
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     searchAPI(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 *
 * // 입력 필드
 * <input
 *   type="text"
 *   value={searchTerm}
 *   onChange={(e) => setSearchTerm(e.target.value)}
 * />
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (delay <= 0) {
      console.warn("useDebounce: delay must be a positive number");
      return;
    }

    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
