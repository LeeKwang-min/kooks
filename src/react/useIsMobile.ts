import { useEffect, useState } from "react";

interface UseIsMobileResult {
  isMobile: boolean;
  isMobileByWidth: boolean;
}

/**
 * 사용자의 접속 환경이 모바일인지 확인하는 Hook
 *
 * 이 훅은 두 가지 방법으로 모바일 환경을 판단합니다:
 * 1. User Agent 문자열을 분석하여 모바일 기기 여부 확인
 * 2. 화면 너비를 기준으로 모바일 환경 여부 판단 (기본값: 768px)
 *
 * @param {number} [width=768] - 모바일 환경을 판단할 기준 너비 (px)
 * @returns {Object} 모바일 환경 여부를 나타내는 객체
 *   - isMobile: User Agent 기반 모바일 여부
 *   - isMobileByWidth: 화면 너비 기반 모바일 여부
 */
export function useIsMobile(width: number = 768): UseIsMobileResult {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileByWidth, setIsMobileByWidth] = useState(false);

  useEffect(() => {
    const checkUserAgent = () => {
      if (typeof navigator === "undefined") return false;
      const userAgent = navigator.userAgent;
      const mobileRegex =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return mobileRegex.test(userAgent);
    };

    const checkWidth = () => {
      if (typeof window === "undefined") return false;
      return window.innerWidth <= width;
    };

    const updateStates = () => {
      setIsMobile(checkUserAgent());
      setIsMobileByWidth(checkWidth());
    };

    updateStates(); // 최초 실행
  }, []);

  return { isMobile, isMobileByWidth };
}
