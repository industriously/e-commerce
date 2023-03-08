import { HttpExceptionFactory } from '@COMMON/exception';
import {
  assignMetadata,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import {
  CUSTOM_ROUTE_ARGS_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { List } from '@UTIL';
import { Request } from 'express';

interface QueryTypeOptions {
  type?: 'string' | 'boolean' | 'number';
  array?: boolean;
  // defaultValue?: T 나중에 typia에서 atomic type에 대해 comment tag를 지원하면 적용 가능
}

const isString = (input: unknown): input is string => typeof input === 'string';

const isUndefined = (input: unknown): input is undefined => input === undefined;

const isStringArray = (input: unknown): input is string[] =>
  Array.isArray(input) && input.every(isString);

const cast = (err: HttpException) => ({
  boolean(value: string): boolean {
    switch (value.toLowerCase()) {
      case 'true':
      case '1':
        return true;
      case 'false':
      case '0':
        return false;
      default:
        throw err;
    }
  },
  number(value: string): number {
    const num = Number(value);
    if (isNaN(num) || value === '') {
      throw err;
    }
    return num;
  },
  string(value: string): string {
    return value;
  },
});

const validator = <T>(
  key: string,
  value: unknown,
  is: (input: unknown) => input is T,
  exception: HttpException,
) => {
  if (!is({ [key]: value })) {
    throw exception;
  }
  return value;
};

const query_type_cast =
  <T>(key: string, ctx: ExecutionContext, options?: QueryTypeOptions) =>
  (is: (input: unknown) => input is T) => {
    const { type = 'string', array = false } = options ?? {};
    const value = ctx.switchToHttp().getRequest<Request>().query[key];
    const exception = HttpExceptionFactory(
      'BadRequest',
      `Value of the URL query '${key}' is invalid.`,
    );
    const _validator = (input: unknown) => validator(key, input, is, exception);
    const type_cast: (input: string) => boolean | number | string =
      cast(exception)[type];

    if (isStringArray(value) && array) {
      return _validator(List.map(type_cast)(value));
    }
    if (isString(value)) {
      if (value === 'undefined') console.log('check');
      const casted = value === '' ? undefined : type_cast(value);
      return _validator(array ? [casted] : casted);
    }
    if (isUndefined(value)) {
      return _validator(array ? [] : undefined);
    }
    throw exception;
  };

export const TypedQuery = <T>(
  key: string,
  is: (input: unknown) => input is T,
  options?: QueryTypeOptions,
): ParameterDecorator => {
  return (target, propertyKey, index) => {
    const args =
      Reflect.getMetadata(
        ROUTE_ARGS_METADATA,
        target.constructor,
        propertyKey,
      ) || {};
    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      {
        ...assignMetadata(args, 4, index, key), // 4 is QUERY
        [`query${CUSTOM_ROUTE_ARGS_METADATA}:${index}`]: {
          index,
          factory: (_: unknown, ctx: ExecutionContext) =>
            query_type_cast(key, ctx, options)(is),
        },
      },
      target.constructor,
      propertyKey,
    );
  };
};
