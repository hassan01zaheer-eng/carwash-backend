import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Role } from './../src/auth/roles.enum';

describe('Role-based Auth (e2e)', () => {
  let app: INestApplication;
  let customerToken: string;
  let ownerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login as customer
    const customerRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'customer@example.com', password: 'password' });
    customerToken = customerRes.body.access_token;

    // Login as shop owner
    const ownerRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'owner@example.com', password: 'password' });
    ownerToken = ownerRes.body.access_token;

    // Login as admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });
    adminToken = adminRes.body.access_token;
  });

  it('Customer can access /test/customer', async () => {
    const res = await request(app.getHttpServer())
      .get('/test/customer')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe(Role.Customer);
  });

  it('Shop Owner can access /test/owner', async () => {
    const res = await request(app.getHttpServer())
      .get('/test/owner')
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe(Role.ShopOwner);
  });

  it('Admin can access /test/admin', async () => {
    const res = await request(app.getHttpServer())
      .get('/test/admin')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe(Role.Admin);
  });

  it('Customer cannot access /test/admin', async () => {
    const res = await request(app.getHttpServer())
      .get('/test/admin')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  it('Owner cannot access /test/customer', async () => {
    const res = await request(app.getHttpServer())
      .get('/test/customer')
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.status).toBe(403);
  });

  it('Admin cannot access /test/owner', async () => {
    const res = await request(app.getHttpServer())
      .get('/test/owner')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(403);
  });

  afterAll(async () => {
    await app.close();
  });
});
