import request from 'supertest';
import app from '../app';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

// NOTE: In a real project, you would mock authentication and the database.
// For demonstration, these tests assume a test database and test tokens.
// You should replace the tokens and setup/teardown logic as needed.

const adminToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODViYmM3M2RjZTE1MzI2ZmQ2ZGRkMDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTA4NDI0ODMsImV4cCI6MTc4MjQwMDA4M30.D1n6wiquY9sZQRxvWO0nuWnKrwVthzpkairTQf7zjAQ'; // Replace with a real or mocked token
const userToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUyZTc3MTE3ZDBlYmJkNzZkOTE2MDEiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNzUwMzI5OTI1LCJleHAiOjE3ODE4ODc1MjV9.7x-C0A2mp4xXf6VNYsDd1SkVrGWVBN0IJRT6Cp5evcY'; // Replace with a real or mocked token

describe('Key Controller', () => {
  // createKey
  it('should not allow non-admin to create a key', async () => {
    const res = await request(app)
      .post('/keys')
      .set('Authorization', userToken)
      .send({ expiryDate: '2025-01-01', numberOfTrials: 5, keyCode: 'TESTKEY' });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/admin/i);
  });

  it('should return 400 if key code already exists', async () => {
    const res = await request(app)
      .post('/keys')
      .set('Authorization', adminToken)
      .send({ expiryDate: '2025-01-01', numberOfTrials: 5, keyCode: 'EXISTINGKEY' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it('should return 422 for missing fields', async () => {
    const res = await request(app)
      .post('/keys')
      .set('Authorization', adminToken)
      .send({});
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  // deleteKey
  it('should not allow non-admin to delete a key', async () => {
    const res = await request(app)
      .delete('/keys/TESTKEY')
      .set('Authorization', userToken);
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/admin/i);
  });

  it('should return 404 when deleting a non-existent key', async () => {
    const res = await request(app)
      .delete('/keys/NOTFOUNDKEY')
      .set('Authorization', adminToken);
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  // deactivateKey
  it('should not allow non-admin to deactivate a key', async () => {
    const res = await request(app)
      .put('/keys/TESTKEY/deactivate')
      .set('Authorization', userToken);
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/admin/i);
  });

  it('should return 404 when deactivating a non-existent key', async () => {
    const res = await request(app)
      .put('/keys/NOTFOUNDKEY/deactivate')
      .set('Authorization', adminToken);
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  // useKey
  it('should return 400 for using a non-existent key', async () => {
    const res = await request(app)
      .post('/keys/use/NOTFOUNDKEY')
      .set('Authorization', userToken)
      .send({ simulationId: 'SIMID' });
    expect([400,404]).toContain(res.status);
  });

  // checkKey
  it('should return valid: false for non-existent key', async () => {
    const res = await request(app)
      .post('/keys/checkKey/NOTFOUNDKEY')
      .send();
    expect(res.body.valid).toBe(false);
  });

  // Token missing tests
  it('should return 401 when creating a key without a token', async () => {
    const res = await request(app)
      .post('/keys')
      .send({ expiryDate: '2025-01-01', numberOfTrials: 5, keyCode: 'TESTKEY' });
    expect(res.status).toBe(401);
  });

  it('should return 401 when deleting a key without a token', async () => {
    const res = await request(app)
      .delete('/keys/TESTKEY');
    expect(res.status).toBe(401);
  });

  it('should return 401 when deactivating a key without a token', async () => {
    const res = await request(app)
      .put('/keys/TESTKEY/deactivate');
    expect(res.status).toBe(401);
  });

  it('should return 401 when using a key without a token', async () => {
    const res = await request(app)
      .post('/keys/use/TESTKEY')
      .send({ simulationId: 'SIMID' });
    expect(res.status).toBe(401);
  });

  // Add more tests for success, no trials left, already used, etc. as needed.
}); 