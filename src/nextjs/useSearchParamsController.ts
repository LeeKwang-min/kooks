import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TSearchParamsValueType =
  | string
  | number
  | (number | string)[]
  | undefined;

/**
 * URL SearchParams를 제어하는 Hook
 * Next.js의 App Router 환경에서 사용 가능합니다.
 *
 * @example
 * ```tsx
 * const { setSearchParams, getSearchParams } = useSearchParamsController();
 *
 * // 단일 파라미터 설정
 * setSearchParams(["page", "1"]);
 *
 * // 여러 파라미터 설정
 * setSearchParams(["page", "1"], ["sort", "desc"]);
 *
 * // 파라미터 값 가져오기
 * const page = getSearchParams("page"); // "1"
 * ```
 *
 * @returns SearchParams를 추가, 수정, 삭제, 초기화할 수 있는 메서드 모음
 */
export const useSearchParamsController = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    /**
     * 전체 SearchParams를 덮어쓴다
     * 기존 파라미터를 모두 제거하고 새로운 파라미터로 교체합니다.
     *
     * @param params - 새로 설정할 모든 검색 파라미터
     * @example
     * ```tsx
     * setSearchParamsAll({ page: "1", sort: "desc" });
     * ```
     */
    setSearchParamsAll: (params: Record<string, string>) => {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => !!v)
      );

      const searchParams = new URLSearchParams(filteredParams);
      router.replace(`${pathname}?${searchParams.toString()}`, {
        scroll: false,
      });
    },
    /**
     * 기존 SearchParams에 특정 키/값만 수정한다
     * 다른 파라미터는 유지한 채로 지정된 파라미터만 수정합니다.
     *
     * @param target - 수정할 키/값 쌍들의 배열
     * @example
     * ```tsx
     * setSearchParams(["page", "1"], ["sort", "desc"]);
     * ```
     */
    setSearchParams: (...target: [string, TSearchParamsValueType][]) => {
      const params = new URLSearchParams(searchParams.toString());
      target.forEach(([key, value]) => {
        const str = value?.toString();
        if (str === undefined || str === "") params.delete(key);
        else {
          params.set(key, str);
        }
      });
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    /**
     * 특정 키의 SearchParam 값을 가져온다
     *
     * @param key - 가져올 키
     * @returns 키에 해당하는 값 (없는 경우 null)
     * @example
     * ```tsx
     * const page = getSearchParams("page"); // "1" 또는 null
     * ```
     */
    getSearchParams: (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      return params.get(key);
    },
    /**
     * 새 SearchParams를 생성하여 덮어쓴다
     * 기존 파라미터를 모두 제거하고 새로운 파라미터로 교체합니다.
     * 배열 값은 '_'로 구분됩니다.
     *
     * @param target - 설정할 키/값 쌍들의 배열
     * @example
     * ```tsx
     * putSearchParams(["tags", ["react", "nextjs"]]); // tags=react_nextjs
     * ```
     */
    putSearchParams: (...target: [string, TSearchParamsValueType][]) => {
      const params = new URLSearchParams();
      target.forEach(([key, value]) => {
        const str = value?.toString();
        if (str === undefined || str.toString() === "") params.delete(key);
        else {
          params.set(
            key,
            Array.isArray(value) ? str.replaceAll(",", "_") : str
          );
        }
      });
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    /**
     * 특정 키들의 SearchParams를 삭제한다
     *
     * @param keys - 삭제할 키 리스트
     * @returns 삭제 후 전체 쿼리 문자열
     * @example
     * ```tsx
     * deleteSearchParams("page", "sort");
     * ```
     */
    deleteSearchParams: (...keys: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      keys.forEach((key) => {
        params.delete(key);
      });
      router.replace(`${pathname}?${params.toString()}`);
      return params.toString();
    },
    /**
     * 모든 SearchParams를 제거한다
     *
     * @example
     * ```tsx
     * resetSearchParams();
     * ```
     */
    resetSearchParams: () => {
      router.replace(`${pathname}`);
    },
  };
};
