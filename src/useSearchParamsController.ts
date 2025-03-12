import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TSearchParamsValueType =
  | string
  | number
  | (number | string)[]
  | undefined;

const useSearchParamsController = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    setSearchParamsAll: (params: Record<string, string>) => {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => !!v)
      );

      const searchParams = new URLSearchParams(filteredParams);
      router.replace(`${pathname}?${searchParams.toString()}`, {
        scroll: false,
      });
    },
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
    getSearchParams: (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      return params.get(key);
    },
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
    deleteSearchParams: (...keys: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      keys.forEach((key) => {
        params.delete(key);
      });
      router.replace(`${pathname}?${params.toString()}`);
      return params.toString();
    },
    resetSearchParams: () => {
      router.replace(`${pathname}`);
    },
  };
};

export default useSearchParamsController;
