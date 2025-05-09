import { useMemo } from "react";

type KeyExtractor<T> = (item: T) => string | number;

/**
 * 배열 내 중복 여부를 판단하고 관련 유틸리티를 제공하는 Hook
 *
 * @template T - 배열의 요소 타입
 * @param {T[]} checkList - 중복 여부를 확인할 배열
 * @param {KeyExtractor<T>} [keyExtractor] - 중복 판단을 위한 키 추출 함수 (선택적)
 *
 * @returns {Object} 중복 관련 유틸리티 객체
 * @property {boolean} isDuplicated - 배열에 중복된 요소가 있는지 여부
 * @property {function(T): boolean} isDuplicatedItem - 특정 아이템이 중복되었는지 확인하는 함수
 * @property {function(): T[]} getNoDuplicatedList - 중복이 제거된 배열을 반환하는 함수
 * @property {function(): T[]} getDuplicatedItems - 중복된 요소들만 반환하는 함수
 *
 * @example
 * // 기본 사용법 (item 자체를 키로 사용)
 * const { isDuplicated } = useIsDuplicated([1, 2, 2, 3]);
 *
 * @example
 * // keyExtractor 사용
 * const { isDuplicated } = useIsDuplicated(
 *   [{ id: 1 }, { id: 2 }, { id: 2 }],
 *   (item) => item.id
 * );
 */
export function useIsDuplicated<T>(
  checkList: T[],
  keyExtractor?: KeyExtractor<T>
) {
  const getKey =
    keyExtractor ?? ((item: T) => item as unknown as string | number);

  const { uniqueKeys, duplicates } = useMemo(() => {
    const seen = new Set<string | number>();
    const duplicates = new Set<string | number>();

    for (const item of checkList) {
      const key = getKey(item);
      if (seen.has(key)) {
        duplicates.add(key);
      } else {
        seen.add(key);
      }
    }

    return { uniqueKeys: seen, duplicates };
  }, [checkList, keyExtractor]);

  const isDuplicated = checkList.length !== uniqueKeys.size;

  const isDuplicatedItem = (item: T) => {
    const key = getKey(item);
    let count = 0;
    for (const i of checkList) {
      if (getKey(i) === key) {
        count++;
        if (count > 1) return true;
      }
    }
    return false;
  };

  const getNoDuplicatedList = () => {
    const map = new Map<string | number, T>();
    for (const item of checkList) {
      const key = getKey(item);
      if (!map.has(key)) {
        map.set(key, item);
      }
    }
    return [...map.values()];
  };

  const getDuplicatedItems = () => {
    return checkList.filter((item) => duplicates.has(getKey(item)));
  };

  return {
    isDuplicated,
    isDuplicatedItem,
    getNoDuplicatedList,
    getDuplicatedItems,
  };
}

export default useIsDuplicated;
