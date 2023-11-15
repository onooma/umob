import * as request from 'supertest';
import { APP_URL } from './constants';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  const app = APP_URL;
  const username = randomStringGenerator();
  const password = randomStringGenerator();

  it('Registers a user', () => {
    return request(app)
      .post('/auth/register')
      .send({ username, password })
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.user).toBeDefined();
      });
  });

  it('Fails to register a user with repetitive username', () => {
    return request(app)
      .post('/auth/register')
      .send({ username, password })
      .expect(HttpStatus.CONFLICT);
  });

  it('Logs in with a user', () => {
    return request(app)
      .post('/auth/login')
      .send({ username, password })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toBeDefined();
      });
  });

  it('Fails to login with wrong username', () => {
    return request(app)
      .post('/auth/login')
      .send({ username: 'wrong', password })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('Fails to login with wrong password', () => {
    return request(app)
      .post('/auth/login')
      .send({ username, password: 'wrong-password' })
      .expect(HttpStatus.NOT_FOUND);
  });
});
