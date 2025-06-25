import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

const adminToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODViYmM3M2RjZTE1MzI2ZmQ2ZGRkMDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTA4NDI0ODMsImV4cCI6MTc4MjQwMDA4M30.D1n6wiquY9sZQRxvWO0nuWnKrwVthzpkairTQf7zjAQ'; // Replace with a real or mocked token

describe('User Controller', () => {
  // createUser
  it('should return 422 for missing registration fields', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ username: '', password: 'short', email: 'not-an-email' });
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 400 for duplicate email/username', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ username: 'existinguser', password: 'ValidPass@123', email: 'existing@email.com' });
    expect([400,409]).toContain(res.status);
  });

  it('should return 400 for invalid/expired keyCode', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ username: 'user2', password: 'ValidPass@123', email: 'user2@email.com', keyCode: 'INVALIDKEY' });
    expect([400,404]).toContain(res.status);
  });

  // createAdmin
  it('should return 422 for missing admin fields', async () => {
    const res = await request(app)
      .post('/users/admins')
      .set('Authorization', adminToken)
      .send({ username: '', password: 'short', email: 'not-an-email' });
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 400 for duplicate admin email/username', async () => {
    const res = await request(app)
      .post('/users/admins')
      .set('Authorization', adminToken)
      .send({ username: 'existingadmin', password: 'ValidPass@123', email: 'existing@email.com' });
    expect([400,409]).toContain(res.status);
  });

  // login
  it('should return 422 for missing login fields', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ username: '', password: '' });
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 401 for wrong credentials', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ username: 'wronguser', password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  // Token missing tests for admin creation
  it('should return 401 when creating admin without a token', async () => {
    const res = await request(app)
      .post('/users/admins')
      .send({ username: 'admin', password: 'ValidPass@123', email: 'admin@email.com' });
    expect(res.status).toBe(401);
  });

  // Add more tests for successful registration, login, logout, etc.
}); 