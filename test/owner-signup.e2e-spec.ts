import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Role } from './../src/auth/roles.enum';

describe('Owner Registration (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should signup a new shop owner with all details', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'owner2@example.com',
        password: 'testpass',
        role: Role.ShopOwner,
        ownerName: 'Owner Name',
        shopName: 'My Car Wash',
        shopAddress: '123 Main St',
        city: 'Metropolis',
        shopLocation: '33.123,-117.123',
      });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('owner2@example.com');
    expect(res.body.user.role).toBe('shop-owner');
    expect(res.body.user.ownerName).toBe('Owner Name');
    expect(res.body.user.shopName).toBe('My Car Wash');
    expect(res.body.user.shopAddress).toBe('123 Main St');
    expect(res.body.user.city).toBe('Metropolis');
    expect(res.body.user.shopLocation).toBe('33.123,-117.123');
  });

  it('should fail if any shop owner detail is missing', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'owner3@example.com',
        password: 'testpass',
        role: Role.ShopOwner,
        ownerName: 'Owner Name',
        shopName: '', // missing
        shopAddress: '123 Main St',
        city: 'Metropolis',
        shopLocation: '33.123,-117.123',
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('All shop owner details are required');
  });

  afterAll(async () => {
    await app.close();
  });
});
