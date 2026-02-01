import { CoreStorageItem } from './CoreStorageItem';

export type LocalStorageItemParams<V> = {
  /**
   * @description Unique string key. It's on you to make sure it's unique
   */
  key: string;
  /**
   * @description Default value of the item
   */
  defaultValue: V;
};
export class LocalStorageItem<V> extends CoreStorageItem<V, string | null, void, void> {
  constructor(params: LocalStorageItemParams<V>) {
    super({
      ...params,
      getFunction: (key: string) => localStorage.getItem(key),
      setFunction: (key: string, value: string) => localStorage.setItem(key, value),
      removeFunction: (key: string) => localStorage.removeItem(key),
    });
  }
}
