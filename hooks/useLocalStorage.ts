"use client";
import { useState, useEffect } from "react";

const tryParse = <T>(val: string | null | undefined, defaultValue?: T) => {
  if (!val) return defaultValue;
  try {
    return JSON.parse(val) as T;
  } catch (e) {
    return defaultValue;
  }
};

function useLocalStorage<T>(
  key: string
): [T | undefined, (newValue: T | undefined) => void];

function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void];

function useLocalStorage<T>(key: string, defaultValue?: T) {
  const lookupKey = `useLocalStorage:${key}`;

  const [value, setValue] = useState<T | undefined>(defaultValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(lookupKey);
      setValue(tryParse<T>(storedValue, defaultValue));
      setIsMounted(true);
    }
  }, [lookupKey]);

  const set = (newValue: T | undefined) => {
    if (!isMounted) return;

    if (newValue === undefined) {
      localStorage.removeItem(lookupKey);
    } else {
      localStorage.setItem(lookupKey, JSON.stringify(newValue));
    }
    setValue(newValue);
  };

  return [value, set] as const;
}

export default useLocalStorage;

// export const useLocalStorage = (key: string) => {};
