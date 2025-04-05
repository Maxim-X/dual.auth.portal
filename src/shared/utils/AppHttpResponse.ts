export class AppHttpResponse<T> {
  public readonly status: boolean = true;
  public readonly message: string = '';
  public readonly user_message: string = '';
  public readonly data: T = {} as T;

  constructor(message: string);
  constructor(message: string, data: T);
  constructor(message: string, user_message: string);
  constructor(message: string, user_message: string, data: T);
  constructor(status: boolean, message: string);
  constructor(status: boolean, message: string, data: T);
  constructor(status: boolean, message: string, user_message: string);
  constructor(status: boolean, message: string, user_message: string, data: T);
  constructor(
    arg1: boolean | string,
    arg2?: object | string,
    arg3?: object | string,
    arg4?: object,
  ) {
    if (typeof arg1 === 'boolean') {
      this.status = arg1;
      this.message = arg2 as string;
      if (arg3 !== undefined && typeof arg3 === 'string') {
        this.user_message = arg3;
      } else if (arg3 !== undefined) {
        this.data = (arg3 as T) ?? this.data;
      }
      if (arg4 !== undefined) {
        this.data = (arg4 as T) ?? this.data;
      }
    } else if (typeof arg1 === 'string') {
      this.status = true;
      this.message = arg1;
      if (typeof arg2 === 'object') {
        this.data = (arg2 as T) ?? this.data;
      } else if (typeof arg2 === 'string') {
        this.user_message = arg2;
      }
      if (arg3 !== undefined) {
        this.data = (arg3 as T) ?? this.data;
      }
    }
  }
}
