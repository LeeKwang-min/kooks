import { usePathname, useRouter } from "next/navigation";

export function useExampleNextJsHook() {
  const pathname = usePathname();
  const router = useRouter();

  return { pathname, push: router.push };
}
