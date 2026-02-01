type GR = (string | null) | Promise<string | null>;
type GF<G_O, G_R extends GR> = ((key: string) => G_R) | ((key: string, options?: G_O) => G_R);

type SR = void | Promise<void>;
type SF<S_O, S_R extends SR> =
  | ((key: string, value: string) => S_R)
  | ((key: string, value: string, options?: S_O) => S_R);

type RR = void | Promise<void>;
type RF<R_O, R_R extends RR> = ((key: string) => R_R) | ((key: string, options?: R_O) => R_R);

export type CoreStorageItemParams<V, G_O, G_R extends GR, S_O, S_R extends SR, R_O, R_R extends RR> = {
  /**
   * @description Unique string key. It's on you to make sure it's unique
   */
  key: string;
  /**
   * @description Default value of the item
   */
  defaultValue: V;
  /**
   * @description Function to get the string value of the item. It will be parsed to JSON
   */
  getFunction: GF<G_O, G_R>;
  /**
   * @description Function to set the stringified value of the item
   */
  setFunction: SF<S_O, S_R>;
  /**
   * @description Function to remove the item
   */
  removeFunction: RF<R_O, R_R>;
};
export class CoreStorageItem<V, G_R extends GR, S_R extends SR, R_R extends RR, G_O = never, S_O = never, R_O = never> {
  public readonly key: string;
  public readonly defaultValue: V;
  private readonly getFunction: GF<G_O, G_R>;
  private readonly setFunction: SF<S_O, S_R>;
  private readonly removeFunction: RF<R_O, R_R>;

  public constructor(params: CoreStorageItemParams<V, G_O, G_R, S_O, S_R, R_O, R_R>) {
    this.key = params.key;
    this.defaultValue = params.defaultValue;
    this.getFunction = params.getFunction;
    this.setFunction = params.setFunction;
    this.removeFunction = params.removeFunction;
  }

  public get(...[options]: [G_O] extends [never] ? [] : [G_O] | []): G_R extends Promise<unknown> ? Promise<V> : V {
    type Response = G_R extends Promise<unknown> ? Promise<V> : V;
    const handleRawValue = (rawValue: string | null) => {
      if (rawValue === null) {
        return this.defaultValue as Response;
      }

      try {
        return JSON.parse(rawValue) as Response;
      } catch {
        console.warn('Failed to parse a stored value');

        return this.defaultValue as Response;
      }
    };

    const response = this.getFunction(this.key, options);

    if (response instanceof Promise) {
      return new Promise((res) => {
        response.then((rawValue) => {
          const result = handleRawValue(rawValue);
          res(result);
        });
      }) as Response;
    } else {
      return handleRawValue(response);
    }
  }

  public set(
    value: V,
    ...[options]: [S_O] extends [never] ? [] : [S_O] | []
  ): S_R extends Promise<unknown> ? Promise<void> : void {
    const stringValue = JSON.stringify(value);
    // biome-ignore lint/suspicious/noConfusingVoidType: It's fine
    type Response = S_R extends Promise<unknown> ? Promise<void> : void;

    const result = this.setFunction(this.key, stringValue, options);

    if (result instanceof Promise) {
      return new Promise<void>((res) => {
        result.then(() => {
          res();
        });
      }) as Response;
    }

    return undefined as Response;
  }

  public remove(
    ...[options]: [R_O] extends [never] ? [] : [R_O] | []
  ): R_R extends Promise<unknown> ? Promise<void> : void {
    const result = this.removeFunction(this.key, options);

    // biome-ignore lint/suspicious/noConfusingVoidType: It's fine
    type Response = R_R extends Promise<unknown> ? Promise<void> : void;

    if (result instanceof Promise) {
      return new Promise<void>((res) => {
        result.then(() => {
          res();
        });
      }) as Response;
    }

    return undefined as Response;
  }
}
