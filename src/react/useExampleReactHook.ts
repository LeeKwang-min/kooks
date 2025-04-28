import { useState } from "react";

export function useExampleReactHook() {
  const [count, setCount] = useState(0);
  return { count, increment: () => setCount((c) => c + 1) };
}
