import { useCallback, useRef, useState } from "react";

interface IProps {
  onLongPress: () => void;
  onClick?: () => void;
  delay?: number;
}

const useLongPress = ({ onLongPress, onClick, delay = 300 }: IProps) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = useCallback(() => {
    setIsLongPress(false);
    timerRef.current = setTimeout(() => {
      setIsLongPress(true);
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const endPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isLongPress && onClick) {
      onClick();
    }

    setIsLongPress(false);
  }, [isLongPress, onClick]);

  return {
    onMouseDown: startPress,
    onMouseUp: endPress,
    // onMouseLeave: endPress,
    onTouchStart: startPress,
    onTouchEnd: endPress,
  };
};

export default useLongPress;
