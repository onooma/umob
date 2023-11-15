import * as request from 'supertest';
import { APP_URL } from './constants';

describe('AppController (e2e)', () => {
  it('Ping: /ping (GET)', () => {
    return request(APP_URL).get('/ping').expect(200).expect('pong');
  });
});
