import { useRouter, usePathname } from "next/navigation";
import { useEffect, useCallback } from "react";

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
  const router = useRouter();
  const pathname = usePathname();

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (shouldBlock) {
        event.preventDefault();
        event.returnValue = "";
      }
    },
    [shouldBlock]
  );

  useEffect(() => {
    if (!shouldBlock) return;

    // 브라우저 새로고침/닫기 방지
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 뒤로가기/앞으로가기 방지
    const handlePopState = (e: PopStateEvent) => {
      if (shouldBlock) {
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);
        if (
          window.confirm(
            "저장되지 않은 변경사항이 있습니다. 정말로 나가시겠습니까?"
          )
        ) {
          window.history.back();
        }
      }
    };

    // 클라이언트 사이드 네비게이션 방지
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        !anchor.href.startsWith("javascript:") &&
        anchor.href !== window.location.href
      ) {
        e.preventDefault();
        if (
          window.confirm(
            "저장되지 않은 변경사항이 있습니다. 정말로 나가시겠습니까?"
          )
        ) {
          router.push(anchor.href);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleClick);

    // 초기 히스토리 상태 추가
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick);
    };
  }, [shouldBlock, router, handleBeforeUnload]);
}
