import { useEffect } from "react";

/**
 * 페이지 이탈 시 사용자에게 경고를 표시하는 Hook
 *
 * @remarks
 * - Chrome, Firefox, Safari, Edge 등 모던 브라우저에서 지원됩니다.
 * - 모바일 브라우저에서는 동작이 제한적일 수 있습니다.
 * - beforeunload 이벤트를 사용하므로, 실제 메시지 내용은 브라우저마다 다르게 표시될 수 있습니다.
 *
 * @param shouldBlock - 이탈 경고를 활성화할지 여부 (기본값: true)
 *
 * @example
 * ```tsx
 * // 폼이 수정되었을 때 이탈 방지
 * const [isFormDirty, setIsFormDirty] = useState(false);
 * useNavigationLock(isFormDirty);
 *
 * // 특정 조건에서만 이탈 방지
 * useNavigationLock(hasUnsavedChanges);
 * ```
 */
export function useNavigationLock(shouldBlock: boolean = true) {
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (shouldBlock) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [shouldBlock]);
}
