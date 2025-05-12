import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 지정된 시간(delay) 후에 콜백 함수를 실행하는 React 훅
 *
 * @param callback - delay 시간 후에 실행될 콜백 함수
 * @param delay - 콜백 함수 실행 전 대기 시간 (밀리초). 음수인 경우 타이머가 시작되지 않음
 * @returns {Object} 타이머 제어를 위한 메서드와 상태
 * @property {Function} start - 타이머 시작
 * @property {Function} clear - 타이머 취소
 * @property {Function} reset - 타이머 재시작
 * @property {boolean} isPending - 타이머가 실행 중인지 여부
 *
 * @example
 * ```tsx
 * const { start, clear, reset, isPending } = useTimeout(() => {
 *   console.log('타이머 완료!');
 * }, 1000);
 * ```
 */
export function useTimeout(callback: () => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedCallback = useRef(callback);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPending(false);
  }, []);

  const start = useCallback(() => {
    if (delay < 0) {
      return;
    }

    clear();
    setIsPending(true);

    timeoutRef.current = setTimeout(() => {
      savedCallback.current();
      timeoutRef.current = null;
      setIsPending(false);
    }, delay);
  }, [delay, clear]);

  const reset = useCallback(() => {
    start();
  }, [start]);

  useEffect(() => clear, [clear]);

  return { start, clear, reset, isPending };
}
