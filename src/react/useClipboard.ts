/**
 * 클립보드 복사 및 붙여넣기 기능을 제공하는 Hook
 *
 * 이 훅은 클립보드 API를 사용하여 텍스트를 복사하고 붙여넣는 기능을 제공합니다.
 * 브라우저 호환성을 자동으로 체크하며, 지원되지 않는 경우 적절한 에러 처리를 수행합니다.
 *
 * @returns {Object} 클립보드 관련 함수들을 포함한 객체
 *   - handleCopy: 텍스트를 클립보드에 복사하는 함수
 *   - handlePaste: 클립보드에서 텍스트를 읽어오는 함수
 *
 * @example
 * ```tsx
 * const { handleCopy, handlePaste } = useClipboard();
 *
 * // 텍스트 복사
 * const copyText = async () => {
 *   const success = await handleCopy('복사할 텍스트');
 *   if (success) {
 *     console.log('복사 성공');
 *   }
 * };
 *
 * // 텍스트 붙여넣기
 * const pasteText = async () => {
 *   const text = await handlePaste();
 *   if (text) {
 *     console.log('붙여넣은 텍스트:', text);
 *   }
 * };
 * ```
 */
export function useClipboard() {
  /**
   * 텍스트를 클립보드에 복사하는 함수
   * @param text - 클립보드에 복사할 텍스트
   * @returns 복사 성공 여부를 나타내는 boolean 값
   */
  const handleCopy = async (text: string): Promise<boolean> => {
    if (!navigator.clipboard) {
      console.warn("useClipboard: Clipboard API is not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("useClipboard: Failed to copy text", error);
      return false;
    }
  };

  /**
   * 클립보드에서 텍스트를 읽어오는 함수
   * @returns 클립보드의 텍스트 또는 읽기 실패 시 false
   */
  const handlePaste = async (): Promise<string | false> => {
    if (!navigator.clipboard) {
      console.warn("useClipboard: Clipboard API is not supported");
      return false;
    }

    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.error("useClipboard: Failed to paste text", error);
      return false;
    }
  };

  return { handleCopy, handlePaste };
}
