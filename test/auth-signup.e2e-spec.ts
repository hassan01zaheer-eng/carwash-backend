import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth Signup (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should signup a new customer', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'newcustomer@example.com', password: 'testpass' });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('newcustomer@example.com');
    expect(res.body.user.role).toBe('customer');
  });

  it('should not allow duplicate signup', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'dupe@example.com', password: 'testpass' });
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'dupe@example.com', password: 'testpass' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email already registered');
  });

  it('should require email and password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: '', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email and password are required');
  });

  afterAll(async () => {
    await app.close();
  });
});
