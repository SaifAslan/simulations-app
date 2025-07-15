import request from 'supertest';
import app from '../app';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

const adminToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODViYmM3M2RjZTE1MzI2ZmQ2ZGRkMDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTA4NDI0ODMsImV4cCI6MTc4MjQwMDA4M30.D1n6wiquY9sZQRxvWO0nuWnKrwVthzpkairTQf7zjAQ'; 
const userToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc0ZGE2NjQxOTRhMTY4MTU1YmI0ZGMiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNzUyNDg4NTUwLCJleHAiOjE3ODQwNDYxNTB9.Pzoy_5wbUxyaQM3KHasavFYY6Kk0evzVKOBeTz3K38Y';

describe('Key Controller', () => {
  // createKey tests
  it('should not allow non-admin to create a key', async () => {
    // Non-admin tries to create a key (should fail with 403)
    const res = await request(app)
      .post('/keys')
      .set('Authorization', userToken)
      .send({ expiryDate: '2025-01-01', numberOfTrials: 5, keyCode: 'TESTKEY' });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/admin/i);
  });

  it('should return 400 if key code already exists', async () => {
    // Admin tries to create a key with an existing keyCode (should fail with 400)
    const res = await request(app)
      .post('/keys')
      .set('Authorization', adminToken)
      .send({ expiryDate: '2025-01-01', numberOfTrials: 5, keyCode: 'EXISTINGKEY' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it('should return 422 for missing fields', async () => {
    // Admin tries to create a key with missing fields (should fail validation)
    const res = await request(app)
      .post('/keys')
      .set('Authorization', adminToken)
      .send({});
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  // deleteKey tests
  it('should not allow non-admin to delete a key', async () => {
    // Non-admin tries to delete a key (should fail with 403)
    const res = await request(app)
      .delete('/keys/TESTKEY')
      .set('Authorization', userToken);
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/admin/i);
  });

  it('should return 404 when deleting a non-existent key', async () => {
    // Admin tries to delete a non-existent key (should fail with 404)
    const res = await request(app)
      .delete('/keys/NOTFOUNDKEY')
      .set('Authorization', adminToken);
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  // deactivateKey tests
  it('should not allow non-admin to deactivate a key', async () => {
    // Non-admin tries to deactivate a key (should fail with 403)
    const res = await request(app)
      .put('/keys/TESTKEY/deactivate')
      .set('Authorization', userToken);
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/admin/i);
  });

  it('should return 404 when deactivating a non-existent key', async () => {
    // Admin tries to deactivate a non-existent key (should fail with 404)
    const res = await request(app)
      .put('/keys/NOTFOUNDKEY/deactivate')
      .set('Authorization', adminToken);
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  // useKey tests
  it('should return 400 for using a non-existent key', async () => {
    // User tries to use a non-existent key (should fail with 400 or 404)
    const res = await request(app)
      .post('/keys/use/NOTFOUNDKEY')
      .set('Authorization', userToken)
      .send({ simulationId: 'SIMID' });
    expect([400,404]).toContain(res.status);
  });

  // checkKey tests
  it('should return valid: false for non-existent key', async () => {
    // Check a non-existent key (should return valid: false)
    const res = await request(app)
      .post('/keys/checkKey/NOTFOUNDKEY')
      .send();
    expect(res.body.valid).toBe(false);
  });

  // Token missing tests
  it('should return 401 when creating a key without a token', async () => {
    // Try to create a key without sending a token (should fail with 401)
    const res = await request(app)
      .post('/keys')
      .send({ expiryDate: '2025-01-01', numberOfTrials: 5, keyCode: 'TESTKEY' });
    expect(res.status).toBe(401);
  });

  it('should return 401 when deleting a key without a token', async () => {
    // Try to delete a key without sending a token (should fail with 401)
    const res = await request(app)
      .delete('/keys/TESTKEY');
    expect(res.status).toBe(401);
  });

  it('should return 401 when deactivating a key without a token', async () => {
    // Try to deactivate a key without sending a token (should fail with 401)
    const res = await request(app)
      .put('/keys/TESTKEY/deactivate');
    expect(res.status).toBe(401);
  });

  it('should return 401 when using a key without a token', async () => {
    // Try to use a key without sending a token (should fail with 401)
    const res = await request(app)
      .post('/keys/use/TESTKEY')
      .send({ simulationId: 'SIMID' });
    expect(res.status).toBe(401);
  });
}); 