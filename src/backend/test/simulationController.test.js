import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

const adminToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODViYmM3M2RjZTE1MzI2ZmQ2ZGRkMDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTA4NDI0ODMsImV4cCI6MTc4MjQwMDA4M30.D1n6wiquY9sZQRxvWO0nuWnKrwVthzpkairTQf7zjAQ'; // Replace with a real or mocked token
const userToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUyZTc3MTE3ZDBlYmJkNzZkOTE2MDEiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNzUwMzI5OTI1LCJleHAiOjE3ODE4ODc1MjV9.7x-C0A2mp4xXf6VNYsDd1SkVrGWVBN0IJRT6Cp5evcY'; // Replace with a real or mocked token


describe('Simulation Controller', () => {
  it('should not allow non-admin to create a simulation', async () => {
    const res = await request(app)
      .post('/simulations')
      .set('Authorization', userToken)
      .send({ name: 'Test Simulation', description: 'Test Desc' });
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Admin access required');
  });

  // Add more tests for success, invalid input, etc.
}); 