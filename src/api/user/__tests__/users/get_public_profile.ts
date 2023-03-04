import { ExceptionResponse } from '@INTERFACE/common';
import { UserSchema } from '@INTERFACE/user';
import { IConnection } from '@nestia/fetcher';
import { HttpStatus } from '@nestjs/common';
import { test_error } from 'src/api/__tests__/common';
import { users } from 'src/sdk/functional';
import typia from 'typia';

export namespace getPublic {
  const api = (connection: IConnection) => (id: string) => {
    return users.getPulicProfile(connection, id);
  };
  export const test_success =
    (connection: IConnection) => async (id: string) => {
      const received = await api(connection)(id);

      typia.assertEquals<UserSchema.Public>(received);
    };

  export const test_user_not_found = (connection: IConnection) =>
    test_error(api(connection))((err) => {
      const received = typia.assertParse<ExceptionResponse>(err.message);

      expect(err.status).toBe(HttpStatus.NOT_FOUND);
      expect(received).toEqual<ExceptionResponse>({
        statusCode: HttpStatus.NOT_FOUND,
        message: '일치하는 대상을 찾지 못했습니다.',
      });
    });

  export const test_invalid_params = (connection: IConnection) =>
    test_error(api(connection))((err) => {
      const received = typia.assertParse<ExceptionResponse>(err.message);

      expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      expect(received).toEqual<ExceptionResponse>({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Value of the URL parameter "user_id" is not a valid UUID.',
      });
    });
}
