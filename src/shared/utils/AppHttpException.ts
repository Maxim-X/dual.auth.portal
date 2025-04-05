import { HttpException, HttpStatus } from '@nestjs/common';

export class AppHttpException extends HttpException {
  public readonly status_pr: boolean;
  public readonly message: string;
  public readonly user_message: string;
  public readonly data: object;

  constructor(message: string);
  constructor(message: string, data: object);
  constructor(message: string, data: object, status: HttpStatus);
  constructor(message: string, user_message: string);
  constructor(message: string, user_message: string, status: HttpStatus);
  constructor(message: string, user_message: string, data: object);
  constructor(
    message: string,
    user_message: string,
    data: object,
    status: HttpStatus,
  );
  constructor(
    arg1: string,
    arg2?: object | string,
    arg3?: object | HttpStatus,
    arg4?: HttpStatus,
  ) {
    let status: HttpStatus = HttpStatus.BAD_REQUEST;
    let message: string = '';
    let user_message: string = '';
    let data: object = {};

    message = arg1;
    if (typeof arg2 === 'object') {
      data = arg2 ?? data;
      if (arg3 !== undefined && typeof arg3 !== 'object') {
        status = arg3;
      }
    } else if (typeof arg2 === 'string') {
      user_message = arg2;
      if (typeof arg3 === 'object') {
        data = arg3;
      } else if (arg3 !== undefined) {
        status = arg3;
      }
    }
    if (arg4 !== undefined) {
      status = arg4;
    }
    super({ status: false, message, user_message, data }, status);
  }
}
