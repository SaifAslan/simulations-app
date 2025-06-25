import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

const adminToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODViYmM3M2RjZTE1MzI2ZmQ2ZGRkMDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTA4NDI0ODMsImV4cCI6MTc4MjQwMDA4M30.D1n6wiquY9sZQRxvWO0nuWnKrwVthzpkairTQf7zjAQ'; // Replace with a real or mocked token
const userToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUyZTc3MTE3ZDBlYmJkNzZkOTE2MDEiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNzUwMzI5OTI1LCJleHAiOjE3ODE4ODc1MjV9.7x-C0A2mp4xXf6VNYsDd1SkVrGWVBN0IJRT6Cp5evcY'; // Replace with a real or mocked token

describe('Leaderboard Controller', () => {
  it('should return 422 for missing score or simulationId', async () => {
    const res = await request(app)
      .post('/leaderboard')
      .set('Authorization', userToken)
      .send({});
    expect(res.status).toBe(422); // Validation error
    expect(res.body.errors).toBeDefined();
  });

  // Add more tests for success, invalid input, etc.
}); 