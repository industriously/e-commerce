import { TypedQuery } from '@COMMON/decorator/http';
import {
  Controller,
  Get,
  HttpStatus,
  INestApplication,
  UseFilters,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HttpExceptionFilter } from '@INFRA/filter/http-exception.filter';
import supertest from 'supertest';
import typia from 'typia';

describe('TypedQuery decorator Test', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('optional', () => {
    it('no query', () => {
      return supertest(app.getHttpServer())
        .get('/null')
        .expect(HttpStatus.OK)
        .expect('success');
    });

    it('single query', () => {
      return supertest(app.getHttpServer())
        .get('/null?query=test')
        .expect(HttpStatus.OK)
        .expect('fail');
    });
  });

  describe('default option', () => {
    it('no query', () => {
      return supertest(app.getHttpServer())
        .get('/nooption')
        .expect(HttpStatus.BAD_REQUEST)
        .expect("Value of the URL query 'query' is invalid.");
    });

    it('single query', () => {
      return supertest(app.getHttpServer())
        .get('/nooption?query=testvalue')
        .expect(HttpStatus.OK)
        .expect('testvalue');
    });

    it('array query', () => {
      return supertest(app.getHttpServer())
        .get('/nooption?query=testvalue1&query=testvalue2')
        .expect(HttpStatus.BAD_REQUEST)
        .expect("Value of the URL query 'query' is invalid.");
    });
  });

  describe('type', () => {
    it.each(['test', '1234', 'true', '0'])('string success', (query) => {
      return supertest(app.getHttpServer())
        .get(`/string?query=${query}`)
        .expect(HttpStatus.OK)
        .expect(query);
    });

    describe('number', () => {
      it.each(['1234', '0x3E8', '00', '1', '0.123'])('success', (query) => {
        return supertest(app.getHttpServer())
          .get(`/number?query=${query}`)
          .expect(HttpStatus.OK)
          .expect((res) => typeof res === 'number');
      });

      it.each(['false', 'a', ''])('fail', (query) => {
        return supertest(app.getHttpServer())
          .get(`/number?query=${query}`)
          .expect(HttpStatus.BAD_REQUEST)
          .expect("Value of the URL query 'query' is invalid.");
      });
    });

    describe('boolean', () => {
      it.each(['true', 'false', '0', '1', 'True', 'False'])(
        'success',
        (query) => {
          return supertest(app.getHttpServer())
            .get(`/boolean?query=${query}`)
            .expect(HttpStatus.OK)
            .expect((res) => typeof res === 'boolean');
        },
      );

      it.each(['2345', '-1', ''])('fail', (query) => {
        return supertest(app.getHttpServer())
          .get(`/boolean?query=${query}`)
          .expect(HttpStatus.BAD_REQUEST)
          .expect("Value of the URL query 'query' is invalid.");
      });
    });

    describe('uuid', () => {
      it.each([
        'a807549c-bc4a-11ed-afa1-0242ac120002', // uuid v1
        'b24c7054-bc4a-11ed-afa1-0242ac120002', // uuid v1
        '24098298-1c36-416a-ab99-4e638e7ffd23', // uuid v4
        'd66b1d9d-b9de-4fe8-9900-b6e0c4254f77', // uuid v4
      ])('success', (query) => {
        return supertest(app.getHttpServer())
          .get(`/uuid?query=${query}`)
          .expect(HttpStatus.OK)
          .expect(query);
      });

      it.each(['string'])('fail', (query) => {
        return supertest(app.getHttpServer())
          .get(`/uuid?query=${query}`)
          .expect(HttpStatus.BAD_REQUEST)
          .expect("Value of the URL query 'query' is invalid.");
      });
    });
  });

  describe('array', () => {
    it('fail', () => {
      return supertest(app.getHttpServer())
        .get('/array/number?query=1234&query=test')
        .expect(HttpStatus.BAD_REQUEST)
        .expect("Value of the URL query 'query' is invalid.");
    });

    it('string', () => {
      return supertest(app.getHttpServer())
        .get('/array/string?query=test')
        .expect(HttpStatus.OK)
        .expect('string');
    });

    it('number', () => {
      return supertest(app.getHttpServer())
        .get('/array/number?query=123')
        .expect(HttpStatus.OK)
        .expect('number');
    });

    it('boolean', () => {
      return supertest(app.getHttpServer())
        .get('/array/boolean?query=true')
        .expect(HttpStatus.OK)
        .expect('boolean');
    });

    it('uuid', () => {
      return supertest(app.getHttpServer())
        .get('/array/uuid?query=7ac1b28a-af67-4094-a458-a23022199a69')
        .expect(HttpStatus.OK)
        .expect('string');
    });
  });
});

const key = 'query';

const isString = typia.createIs<{ [key]: string }>();
const isNumber = typia.createIs<{ [key]: number }>();
const isBoolean = typia.createIs<{ [key]: boolean }>();
const isUUID = typia.createIs<{
  /**
   * @format uuid
   */
  query: string;
}>();
const isOptional = typia.createIs<{ [key]?: string }>();

const isStringArray = typia.createIs<{ [key]: string[] }>();
const isNumberArray = typia.createIs<{ [key]: number[] }>();
const isBooleanArray = typia.createIs<{ [key]: boolean[] }>();
const isUUIDArray = typia.createIs<{
  /**
   * @format uuid
   */
  query: string[];
}>();

@Controller()
@UseFilters(HttpExceptionFilter)
class TestController {
  @Get('nooption')
  test1(@TypedQuery(key, isString) query: string) {
    return typeof query === 'string' ? query : 'fail';
  }

  @Get('string')
  test2(@TypedQuery(key, isString, { type: 'string' }) query: string) {
    return typeof query === 'string' ? query : 'fail';
  }

  @Get('number')
  test3(@TypedQuery(key, isNumber, { type: 'number' }) query: number) {
    return typeof query === 'number' ? query : 'fail';
  }

  @Get('boolean')
  test4(@TypedQuery(key, isBoolean, { type: 'boolean' }) query: boolean) {
    return typeof query === 'boolean' ? query : 'fail';
  }

  @Get('uuid')
  test5(@TypedQuery(key, isUUID) query: string) {
    return typeof query === 'string' ? query : 'fail';
  }

  @Get('null')
  test6(@TypedQuery(key, isOptional) query?: string) {
    return query === undefined ? 'success' : 'fail';
  }

  @Get('array/string')
  test7(
    @TypedQuery(key, isStringArray, { type: 'string', array: true })
    query: string[],
  ) {
    return Array.isArray(query) ? typeof query[0] : 'fail';
  }

  @Get('array/number')
  test8(
    @TypedQuery(key, isNumberArray, { type: 'number', array: true })
    query: number[],
  ) {
    return Array.isArray(query) ? typeof query[0] : 'fail';
  }

  @Get('array/boolean')
  test9(
    @TypedQuery(key, isBooleanArray, { type: 'boolean', array: true })
    query: boolean[],
  ) {
    return Array.isArray(query) ? typeof query[0] : 'fail';
  }

  @Get('array/uuid')
  test10(
    @TypedQuery(key, isUUIDArray, { type: 'string', array: true })
    query: string[],
  ) {
    return Array.isArray(query) ? typeof query[0] : 'fail';
  }
}
