import { useCallback, useRef, useState } from "react";

interface IProps {
  /**
   * 롱프레스 시 실행할 콜백 함수
   */
  onLongPress: () => void;
  /**
   * 일반 클릭 시 실행할 콜백 함수
   */
  onClick?: () => void;
  /**
   * 롱프레스로 인식할 시간(ms)
   * @default 300
   */
  delay?: number;
}

interface IReturn {
  /**
   * 마우스/터치 이벤트 핸들러
   */
  handlers: {
    onMouseDown: () => void;
    onMouseUp: () => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
  };
  /**
   * 현재 롱프레스 상태
   */
  isLongPressing: boolean;
}

/**
 * 클릭과 롱프레스를 구분하는 Hook
 *
 * @param props - Hook 설정
 * @param props.onLongPress - 롱프레스 콜백
 * @param props.onClick - 일반 클릭 콜백
 * @param props.delay - 롱프레스로 인식할 시간(ms) (기본값: 300)
 *
 * @example
 * ```tsx
 * const { handlers, isLongPressing } = useLongPress({
 *   onLongPress: () => console.log("롱프레스!"),
 *   onClick: () => console.log("클릭!"),
 *   delay: 500
 * });
 *
 * return (
 *   <button {...handlers}>
 *     {isLongPressing ? "롱프레스 중..." : "버튼"}
 *   </button>
 * );
 * ```
 */
export const useLongPress = ({
  onLongPress,
  onClick,
  delay = 300,
}: IProps): IReturn => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = useCallback(() => {
    setIsLongPressing(false);
    timerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const endPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isLongPressing && onClick) {
      onClick();
    }

    setIsLongPressing(false);
  }, [isLongPressing, onClick]);

  return {
    handlers: {
      onMouseDown: startPress,
      onMouseUp: endPress,
      onTouchStart: startPress,
      onTouchEnd: endPress,
    },
    isLongPressing,
  };
};
