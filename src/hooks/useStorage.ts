/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect, useState } from 'react';

/* The use storage initial value type */
export type UseStorageInitialValue<T> = (() => T) | T;

/* The use storage options type */
export interface UseStorageOptions<T> {
  /* The initial value of the storage */
  initialValue?: UseStorageInitialValue<T>;
  /* The storage to be used */
  storage?: Storage;
  /* The deserializer function to be invoked */
  deserializer?: (value: string) => T;
  /* The serializer function to be invoked */
  serializer?: (value: T) => string;
}

/* The use storage return type */
export interface UseStorageReturn<T> {
  /* The value of the storage */
  value: T;
  /* The error state of the storage */
  remove: () => void;
  /* The loading state of the storage */
  set: (value: T) => void;
}

export interface UseStorage {
  <T>(key: string, options?: UseStorageOptions<T>): UseStorageReturn<T | undefined>;

  <T>(
    key: string,
    initialValue?: UseStorageInitialValue<T>
  ): UseStorageReturn<T | undefined>;
}

export const STORAGE_EVENT = 'reactuse-storage';

export const dispatchStorageEvent = (params: Partial<StorageEvent>) =>
  window.dispatchEvent(new StorageEvent(STORAGE_EVENT, params));

const setStorageItem = (storage: Storage, key: string, value: string) => {
  const oldValue = storage.getItem(key);

  storage.setItem(key, value);
  dispatchStorageEvent({
    key,
    oldValue,
    newValue: value,
    storageArea: storage
  });
};

const removeStorageItem = (storage: Storage, key: string) => {
  const oldValue = storage.getItem(key);

  storage.removeItem(key);
  dispatchStorageEvent({ key, oldValue, newValue: null, storageArea: storage });
};

const getStorageItem = (storage: Storage, key: string) => {
  const value = storage.getItem(key);
  if (!value) return undefined;
  return value;
};

/**
 * @name useStorage
 * @description - Hook that manages storage value
 * @category Browser
 *
 * @overload
 * @param {string} key The key of the storage
 * @param {UseStorageInitialValue<Value>} [initialValue] The initial value of the storage
 * @returns {UseStorageReturn<Value>} The value and the set function
 *
 * @overload
 * @param {string} key The key of the storage
 * @param {(value: Value) => string} [params.serializer] The serializer function
 * @param {(value: string) => Value} [params.deserializer] The deserializer function
 * @param {Storage} [params.storage] The storage
 * @param {UseStorageInitialValue<Value>} [params.initialValue] The initial value of the storage
 * @returns {UseStorageReturn<Value>} The value and the set function
 *
 * @example
 * const { value, set, remove } = useStorage('key', 'value');
 */
export const useStorage = (<T>(key: string, params?: any): UseStorageReturn<T> => {
  const options = (
    typeof params === 'object' &&
      params &&
      ('serializer' in params ||
        'deserializer' in params ||
        'initialValue' in params ||
        'storage' in params)
      ? params
      : undefined
  ) as UseStorageOptions<T>;

  const initialValue = (options ? options?.initialValue : params) as UseStorageInitialValue<T>;

  if (typeof window === 'undefined') {
    const value = typeof initialValue === 'function' ? (initialValue as () => any)() : initialValue;
    return {
      value,
      set: () => { },
      remove: () => { }
    };
  }

  const serializer = (value: T) => {
    if (options?.serializer) return options.serializer(value);
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };

  const storage = options?.storage ?? window?.localStorage;

  const set = (value: T) => setStorageItem(storage, key, serializer(value));
  const remove = () => removeStorageItem(storage, key);

  const deserializer = (value: string) => {
    if (options?.deserializer) return options.deserializer(value);
    if (value === 'undefined') return undefined as unknown as T;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  };

  const [value, setValue] = useState<T | undefined>(() => {
    const storageValue = getStorageItem(storage, key);
    if (storageValue === undefined && initialValue !== undefined) {
      const value =
        typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
      setStorageItem(storage, key, serializer(value));
      return value;
    }
    return storageValue ? deserializer(storageValue) : undefined;
  });

  useEffect(() => {
    const onChange = () => {
      const storageValue = getStorageItem(storage, key);
      setValue(storageValue ? deserializer(storageValue) : undefined);
    };
    window.addEventListener(STORAGE_EVENT, onChange);
    return () => window.removeEventListener(STORAGE_EVENT, onChange);
  }, [key]);

  return {
    value: value as T,
    set,
    remove
  };
}) as UseStorage;
