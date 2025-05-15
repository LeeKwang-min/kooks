import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TSearchParamsValue =
  | string
  | number
  | (number | string)[]
  | undefined
  | null;

export type StringKeys<T> = Extract<keyof T, string>;

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

export const useSearchParamsController = <
  T extends object = Record<string, unknown>
>() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const commitSearchParams = (
    params?: URLSearchParams,
    options?: { scroll?: boolean }
  ) => {
    const query = params?.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, options);
  };

  return {
    getSearchParams: (key: StringKeys<T>) => {
      return searchParams.get(key);
    },
    setSearchParams: (...target: [StringKeys<T>, TSearchParamsValue][]) => {
      const params = createSearchParams(target, searchParams.toString());
      commitSearchParams(params, { scroll: false });
    },
    putSearchParams: (...target: [StringKeys<T>, TSearchParamsValue][]) => {
      const params = createSearchParams(target);
      commitSearchParams(params, { scroll: false });
    },
    deleteSearchParams: (...keys: StringKeys<T>[]) => {
      const params = new URLSearchParams(searchParams.toString());
      keys.forEach((key) => {
        params.delete(key);
      });
      commitSearchParams(params);
    },
    resetSearchParams: () => {
      commitSearchParams();
    },
    searchParamsToString: () => {
      return searchParams.toString();
    },
    commitSearchParams,
  };
};

const createSearchParams = (
  target: [string, TSearchParamsValue][],
  defaultPrams?: string
) => {
  const params = new URLSearchParams(defaultPrams);
  target.forEach(([key, value]) => {
    const str = value?.toString().trim();
    if (str === undefined || str === null || str === "") params.delete(key);
    else params.set(key, str);
  });
  return params;
};
