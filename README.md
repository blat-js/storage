# @blat-js/storage

## Description

This package helps simplify working with different kinds of storage. You can use built-in storage items for `localStorage` and `cookies`, or create your own storage item by extending the `CoreStorageItem` class.

## Installation

1. Install the main package

```bash
npm install @blat-js/storage
```

2. If you want to use the `CookieItem`, then you also need to install `js-cookie` dependency.

```bash
npm install js-cookie && npm install -D @types/js-cookie
```

## Usage

### `LocalStorageItem`

Works in browsers only.

Example:

```ts
import { LocalStorageItem } from "@blat-js/storage/LocalStorageItem";

type TodoItem = {
  id: string;
  title: string;
  isCompleted: boolean;
};
const todosStorage = new LocalStorageItem<TodoItem[]>({
  key: "app-todos",
  defaultValue: [],
});
// ...
// To get stored data
const storedTodos: TodoItem[] = todosStorage.get();
// ...
// To set new value
const updateTodos = (newTodos: TodoItem[]) => {
  todosStorage.set(newTodos);
};
// ...
// To clear value
const clearTodos = () => {
  todosStorage.remove();
};
```

### `CookieItem`

Works in browsers only.

`CookieItem` is a thin wrapper around `js-cookie`.

Example:

```ts
import { CookieItem } from "@blat-js/storage/CookieItem";

const tokenStorage = new CookieItem<string | null>({
  key: "auth-token",
  defaultValue: null,
});
// ...
// To get stored data
const storedToken = tokenStorage.get();
// ...
// To set new value
const setToken = (newToken: string) => {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
  // Cookie options are passed directly to `js-cookie`.
  tokenStorage.set(newToken, {
    domain: "mu-domain.com",
    path: "/",
    secure: true,
    sameSite: "strict",
    expires,
  });
};
// ...
// To clear value
const logOut = () => {
  tokenStorage.remove();
};
```

### `CoreStorageItem`

You can create your own storage class with any parameters that you need. CoreStorageItem supports both sync and async storages. If your storage API is async, `get`, `set`, and `remove` will automatically return promises.

Example:

```ts
import { CoreStorageItem } from "@blat-js/storage/CoreStorageItem";

type GetOptions = { some: string };
type SetOptions = { other: number };
type RemoveOptions = { else: boolean };

export type MyStorageParams<V> = {
  key: string;
  defaultValue: V;
};
export class MyStorage<V> extends CoreStorageItem<
  V,
  Promise<string | null>,
  Promise<void>,
  void,
  GetOptions,
  SetOptions,
  RemoveOptions
> {
  constructor(params: MyStorageParams<V>) {
    super({
      ...params,
      getFunction: async (key: string, options?: GetOptions) => {
        const result = await yourStorage.getItem(key, options);
        return result;
      },
      setFunction: async (key: string, value: string, options?: SetOptions) => {
        await yourStorage.setItem(key, value, options);
      },
      removeFunction: (key: string, options?: RemoveOptions) => {
        yourStorage.removeItem(key, options);
      },
    });
  }
}
// ...
const myStorage = new MyStorage<number>({
  key: "counter",
  defaultValue: 0,
});
// ...
// To get stored data
const getValue = async () => {
  const storedValue: number = await myStorage.get({ some: "test" });
};
// ...
// To set new value
const updateValue = async (newValue: number) => {
  await myStorage.set(newValue, { other: 123 });
};
// ...
// To clear value
const clearStorage = () => {
  myStorage.remove({ else: true });
};
```

## Notes

- Package has barrel file, so you can import everything from the package root. However, specific imports are recommended.

```ts
// Import from the barrel file:
import {
  CookieItem,
  CookieItemParams,
  LocalStorageItem,
  LocalStorageItemParams,
  CoreStorageItem,
  CoreStorageItemParams,
} from "@blat-js/storage";
// Specific imports:
import {
  LocalStorageItem,
  LocalStorageItemParams,
} from "@blat-js/storage/LocalStorageItem";
import { CookieItem, CookieItemParams } from "@blat-js/storage/CookieItem";
import {
  CoreStorageItem,
  CoreStorageItemParams,
} from "@blat-js/storage/CoreStorageItem";
```

- Default value is fully typed and returned when storage is empty.

## API

All storage items expose the same API:

- `get(options?)` → `T | Promise<T>`
- `set(value, options?)` → `void | Promise<void>`
- `remove(options?)` → `void | Promise<void>`

Options argument will be typed automatically via generic types, based on provided types.

## Why

- Unified API for different storages
- Strong TypeScript typings
- No framework dependency
- Easy to extend

## Environment

- `LocalStorageItem` works in browsers
- `CookieItem` requires `js-cookie` and `@types/js-cookie`
- `CoreStorageItem` can be used in any environment

## Status

Actively maintained

## License

MIT
