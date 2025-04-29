import { useEffect, useRef } from "react";

/**
 * 지정한 간격으로 콜백 함수를 실행하는 Hook
 *
 * @param callback - 실행할 콜백 함수
 * @param delay - 콜백 실행 간격(ms)
 *   - null: 인터벌 중지
 *   - 0 이하: 인터벌 중지 (경고 메시지 출력)
 *   - 양수: 지정된 간격으로 실행
 *
 * @example
 * ```tsx
 * // 기본 사용
 * useInterval(() => {
 *   console.log("1초마다 실행");
 * }, 1000);
 *
 * // 조건부 실행
 * const [isRunning, setIsRunning] = useState(true);
 * useInterval(() => {
 *   console.log("실행 중...");
 * }, isRunning ? 1000 : null);
 *
 * // 컴포넌트 언마운트 시 자동 정리
 * useInterval(() => {
 *   // 정리 함수가 자동으로 호출됨
 * }, 1000);
 * ```
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    if (delay <= 0) {
      console.warn("useInterval: delay must be a positive number");
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
