import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

const adminToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODViYmM3M2RjZTE1MzI2ZmQ2ZGRkMDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTA4NDI0ODMsImV4cCI6MTc4MjQwMDA4M30.D1n6wiquY9sZQRxvWO0nuWnKrwVthzpkairTQf7zjAQ'; // Replace with a real or mocked token

describe('User Controller', () => {
  // Registration tests
  it('should return 422 for missing registration fields', async () => {
    // Test registration with missing/invalid fields (should fail validation)
    const res = await request(app)
      .post('/users/register')
      .send({ username: '', password: 'short', email: 'not-an-email' });
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 400 for duplicate email/username', async () => {
    // Test registration with an already used email/username (should fail)
    const res = await request(app)
      .post('/users/register')
      .send({ username: 'existinguser', password: 'ValidPass@123', email: 'existing@email.com' });
    expect([400,409]).toContain(res.status);
  });

  it('should return 400 for invalid/expired keyCode', async () => {
    // Test registration with an invalid or expired keyCode (should fail)
    const res = await request(app)
      .post('/users/register')
      .send({ username: 'user2', password: 'ValidPass@123', email: 'user2@email.com', keyCode: 'INVALIDKEY' });
    expect([400,404]).toContain(res.status);
  });

  // Admin creation tests
  it('should return 422 for missing admin fields', async () => {
    // Test admin creation with missing/invalid fields (should fail validation)
    const res = await request(app)
      .post('/users/admins')
      .set('Authorization', adminToken)
      .send({ username: '', password: 'short', email: 'not-an-email' });
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 400 for duplicate admin email/username', async () => {
    // Test admin creation with an already used email/username (should fail)
    const res = await request(app)
      .post('/users/admins')
      .set('Authorization', adminToken)
      .send({ username: 'existingadmin', password: 'ValidPass@123', email: 'existing@email.com' });
    expect([400,409]).toContain(res.status);
  });

  // Login tests
  it('should return 422 for missing login fields', async () => {
    // Test login with missing/invalid fields (should fail validation)
    const res = await request(app)
      .post('/users/login')
      .send({ username: '', password: '' });
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 401 for wrong credentials', async () => {
    // Test login with wrong credentials (should fail authentication)
    const res = await request(app)
      .post('/users/login')
      .send({ username: 'wronguser', password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  // Token missing test for admin creation
  it('should return 401 when creating admin without a token', async () => {
    // Test admin creation without sending a token (should fail with 401)
    const res = await request(app)
      .post('/users/admins')
      .send({ username: 'admin', password: 'ValidPass@123', email: 'admin@email.com' });
    expect(res.status).toBe(401);
  });

}); 