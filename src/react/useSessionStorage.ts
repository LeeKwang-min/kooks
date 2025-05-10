import React, { useCallback, useEffect, useState } from "react";

/**
 * 세션 스토리지 데이터를 관리하는 Hook
 *
 * 이 훅은 브라우저의 sessionStorage를 사용하여 데이터를 저장하고 관리하는 기능을 제공합니다.
 * 데이터의 타입 안전성을 보장하며, JSON 직렬화/역직렬화를 자동으로 처리합니다.
 * 세션 스토리지는 브라우저 탭이 닫힐 때까지 데이터가 유지됩니다.
 *
 * @template T - 저장할 데이터의 타입
 * @param key - sessionStorage에 저장될 키
 * @param initialValue - 초기값
 * @returns {Object} 세션 스토리지 관련 함수들을 포함한 객체
 *   - value: 현재 저장된 값
 *   - setValue: 값을 업데이트하는 함수
 *   - removeValue: 값을 제거하는 함수
 *
 * @example
 * ```tsx
 * const { value, setValue, removeValue } = useSessionStorage('user', { name: 'John' });
 *
 * // 값 업데이트
 * setValue({ name: 'Jane' });
 *
 * // 값 제거
 * removeValue();
 * ```
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // 컴포넌트 마운트 시 스토리지 값 확인
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("useSessionStorage: Failed to read value", error);
    }
  }, [key]);

  // 스토리지 값 변경 감지 및 동기화
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === window.sessionStorage) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setValue(newValue);
        } catch (error) {
          console.error("useSessionStorage: Failed to parse new value", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);

  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);

        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error("useSessionStorage: Failed to set value", error);
      }
    },
    [key, value]
  );

  const removeStoredValue = useCallback(() => {
    try {
      setValue(initialValue);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error("useSessionStorage: Failed to remove value", error);
    }
  }, [key, initialValue]);

  return { value, setValue: setStoredValue, removeValue: removeStoredValue };
}
