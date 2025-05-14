import { useEffect, useState } from "react";

type Theme = "light" | "dark";

interface UseSystemThemeResult {
  systemTheme: Theme;
  isDarkMode: boolean;
  isLightMode: boolean;
}

/**
 * 사용자의 시스템에 설정된 테마를 감지하는 Hook
 *
 * 이 훅은 사용자의 시스템 설정에서 다크 모드 여부를 감지하여 반환합니다.
 * 시스템의 테마 설정이 변경될 때마다 자동으로 업데이트됩니다.
 *
 * @returns {Object} 시스템 테마 정보를 담은 객체
 *   - systemTheme: 현재 시스템 테마 ("light" | "dark")
 *   - isDarkMode: 시스템 테마가 다크 모드인지 여부
 *   - isLightMode: 시스템 테마가 라이트 모드인지 여부
 */
export function useSystemTheme(): UseSystemThemeResult {
  const [systemTheme, setSystemTheme] = useState<Theme>("light");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    updateTheme(mediaQuery); // 초기 설정
    mediaQuery.addEventListener("change", updateTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateTheme);
    };
  }, []);

  return {
    systemTheme,
    isDarkMode: systemTheme === "dark",
    isLightMode: systemTheme === "light",
  };
}
