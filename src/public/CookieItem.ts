import Cookies from 'js-cookie';
import { CoreStorageItem } from './CoreStorageItem';

export type CookieItemParams<V> = {
  /**
   * @description Unique string key. It's on you to make sure it's unique
   */
  key: string;
  /**
   * @description Default value of the item
   */
  defaultValue: V;
};
export class CookieItem<V> extends CoreStorageItem<V, string | null, void, void, never, Cookies.CookieAttributes> {
  constructor(params: CookieItemParams<V>) {
    super({
      ...params,
      getFunction: (key: string) => Cookies.get(key) ?? null,
      setFunction: (key: string, value: string, options?: Cookies.CookieAttributes) => Cookies.set(key, value, options),
      removeFunction: (key: string) => Cookies.remove(key),
    });
  }
}
