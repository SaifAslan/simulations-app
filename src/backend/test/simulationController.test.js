import request from 'supertest';
import app from '../app';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Simulation from '../models/Simulation';
import mongoose from 'mongoose';

const adminToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODViYmM3M2RjZTE1MzI2ZmQ2ZGRkMDQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTA4NDI0ODMsImV4cCI6MTc4MjQwMDA4M30.D1n6wiquY9sZQRxvWO0nuWnKrwVthzpkairTQf7zjAQ';
const userToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc0ZGE2NjQxOTRhMTY4MTU1YmI0ZGMiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNzUyNDg4NTUwLCJleHAiOjE3ODQwNDYxNTB9.Pzoy_5wbUxyaQM3KHasavFYY6Kk0evzVKOBeTz3K38Y';

describe('Simulation Controller', () => {
  let testSimulation;
  let deletedSimulation;

  beforeEach(async () => {
    // Clean up database
    await Simulation.deleteMany({});
    
    // Create test simulations
    testSimulation = await Simulation.create({
      name: 'Test Simulation',
      description: 'Test Description',
      route: 'test-simulation'
    });

    deletedSimulation = await Simulation.create({
      name: 'Deleted Simulation',
      description: 'Deleted Description',
      route: 'deleted-simulation',
      isDeleted: true,
      deletedAt: new Date()
    });
  });

  afterEach(async () => {
    await Simulation.deleteMany({});
  });

  describe('POST /simulations - Create Simulation', () => {
    it('should create a simulation successfully as admin', async () => {
      const res = await request(app)
        .post('/simulations')
        .set('Authorization', adminToken)
        .send({ 
          name: 'New Simulation', 
          description: 'New Description',
          route: 'new-simulation'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('New Simulation');
      expect(res.body.description).toBe('New Description');
      expect(res.body.route).toBe('new-simulation');
      expect(res.body.isDeleted).toBe(false);
      expect(res.body.createdAt).toBeDefined();
      expect(res.body.updatedAt).toBeDefined();
    });

    it('should not allow non-admin to create a simulation', async () => {
      const res = await request(app)
        .post('/simulations')
        .set('Authorization', userToken)
        .send({ 
          name: 'Test Simulation', 
          description: 'Test Desc',
          route: 'test-sim'
        });
      
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Admin access required');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/simulations')
        .send({ 
          name: 'Test Simulation', 
          description: 'Test Desc',
          route: 'test-sim'
        });
      
      expect(res.status).toBe(401);
    });

    it('should fail with missing name', async () => {
      const res = await request(app)
        .post('/simulations')
        .set('Authorization', adminToken)
        .send({ 
          description: 'Test Desc',
          route: 'test-sim'
        });
      
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail with missing description', async () => {
      const res = await request(app)
        .post('/simulations')
        .set('Authorization', adminToken)
        .send({ 
          name: 'Test Simulation',
          route: 'test-sim'
        });
      
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail with missing route', async () => {
      const res = await request(app)
        .post('/simulations')
        .set('Authorization', adminToken)
        .send({ 
          name: 'Test Simulation',
          description: 'Test Description'
        });
      
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail with invalid route format', async () => {
      const res = await request(app)
        .post('/simulations')
        .set('Authorization', adminToken)
        .send({ 
          name: 'Test Simulation',
          description: 'Test Description',
          route: 'invalid route with spaces'
        });
      
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail with route containing uppercase letters', async () => {
      const res = await request(app)
        .post('/simulations')
        .set('Authorization', adminToken)
        .send({ 
          name: 'Test Simulation',
          description: 'Test Description',
          route: 'InvalidRoute'
        });
      
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail with route containing special characters', async () => {
      const res = await request(app)
        .post('/simulations')
        .set('Authorization', adminToken)
        .send({ 
          name: 'Test Simulation',
          description: 'Test Description',
          route: 'invalid@route#'
        });
      
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail with duplicate route', async () => {
      const res = await request(app)
        .post('/simulations')
        .set('Authorization', adminToken)
        .send({ 
          name: 'Another Simulation',
          description: 'Another Description',
          route: 'test-simulation' // Same as testSimulation
        });
      
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Route already exists');
    });

    it('should fail with invalid data types', async () => {
      const res = await request(app)
        .post('/simulations')
        .set('Authorization', adminToken)
        .send({ 
          name: 123, 
          description: true,
          route: 456
        });
      
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('GET /simulations - Get All Simulations', () => {
    it('should get all non-deleted simulations', async () => {
      const res = await request(app)
        .get('/simulations')
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Test Simulation');
      expect(res.body[0].route).toBe('test-simulation');
    });

    it('should not include deleted simulations', async () => {
      const res = await request(app)
        .get('/simulations')
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(200);
      const deletedSim = res.body.find(s => s.name === 'Deleted Simulation');
      expect(deletedSim).toBeUndefined();
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .get('/simulations');
      
      expect(res.status).toBe(401);
    });

    it('should not allow non-admin to get all simulations', async () => {
      const res = await request(app)
        .get('/simulations')
        .set('Authorization', userToken);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Admin access required');
    });
  });

  describe('GET /simulations/route/:route - Get Simulation by Route', () => {
    it('should get a simulation by route', async () => {
      const res = await request(app)
        .get('/simulations/route/test-simulation')
        .set('Authorization', userToken);
      
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test Simulation');
      expect(res.body.route).toBe('test-simulation');
      expect(res.body._id).toBe(testSimulation._id.toString());
    });

    it('should return 404 for non-existent route', async () => {
      const res = await request(app)
        .get('/simulations/route/non-existent-route')
        .set('Authorization', userToken);
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Simulation not found');
    });

    it('should return 422 for route with spaces', async () => {
      const res = await request(app)
        .get('/simulations/route/invalid route')
        .set('Authorization', userToken);
      
      expect(res.status).toBe(422);
    });

    it('should allow any authenticated user to access by route', async () => {
      const res = await request(app)
        .get('/simulations/route/test-simulation')
        .set('Authorization', userToken);
      
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test Simulation');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .get('/simulations/route/test-simulation');
      
      expect(res.status).toBe(401);
    });
  });

  describe('GET /simulations/:id - Get Simulation by ID', () => {
    it('should get a simulation by ID', async () => {
      const res = await request(app)
        .get(`/simulations/${testSimulation._id}`)
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test Simulation');
      expect(res.body.route).toBe('test-simulation');
      expect(res.body._id).toBe(testSimulation._id.toString());
    });

    it('should not get deleted simulation', async () => {
      const res = await request(app)
        .get(`/simulations/${deletedSimulation._id}`)
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Simulation not found');
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/simulations/${fakeId}`)
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(404);
    });

    it('should return 422 for invalid ID format', async () => {
      const res = await request(app)
        .get('/simulations/invalid-id')
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(422);
    });

    it('should not allow non-admin to get a simulation by ID', async () => {
      const res = await request(app)
        .get(`/simulations/${testSimulation._id}`)
        .set('Authorization', userToken);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Admin access required');
    });
  });

  describe('POST /simulations/multiple - Get Multiple Simulations', () => {
    it('should get multiple simulations by IDs', async () => {
      const sim2 = await Simulation.create({
        name: 'Second Simulation',
        description: 'Second Description',
        route: 'second-simulation'
      });

      const res = await request(app)
        .post('/simulations/multiple')
        .set('Authorization', adminToken)
        .send({ 
          ids: [testSimulation._id.toString(), sim2._id.toString()] 
        });
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should filter out deleted simulations', async () => {
      const res = await request(app)
        .post('/simulations/multiple')
        .set('Authorization', adminToken)
        .send({ 
          ids: [testSimulation._id.toString(), deletedSimulation._id.toString()] 
        });
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]._id).toBe(testSimulation._id.toString());
    });

    it('should handle invalid IDs gracefully', async () => {
      const res = await request(app)
        .post('/simulations/multiple')
        .set('Authorization', adminToken)
        .send({ 
          ids: [testSimulation._id.toString(), 'invalid-id'] 
        });
      
      expect(res.status).toBe(422);
    });

    it('should return 422 for non-array input', async () => {
      const res = await request(app)
        .post('/simulations/multiple')
        .set('Authorization', adminToken)
        .send({ 
          ids: 'not-an-array' 
        });
      
      expect(res.status).toBe(422);
    });

    it('should return 422 for empty array', async () => {
      const res = await request(app)
        .post('/simulations/multiple')
        .set('Authorization', adminToken)
        .send({ 
          ids: [] 
        });
      
      expect(res.status).toBe(422);
    });

    it('should not allow non-admin to get multiple simulations', async () => {
      const res = await request(app)
        .post('/simulations/multiple')
        .set('Authorization', userToken)
        .send({ ids: [testSimulation._id.toString()] });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Admin access required');
    });
  });

  describe('PUT /simulations/:id - Update Simulation', () => {
    it('should update a simulation successfully as admin', async () => {
      const res = await request(app)
        .put(`/simulations/${testSimulation._id}`)
        .set('Authorization', adminToken)
        .send({ 
          name: 'Updated Name', 
          description: 'Updated Description',
          route: 'updated-route'
        });
      
      expect(res.status).toBe(200);
      expect(res.body?.name).toBe('Updated Name');
      expect(res.body?.description).toBe('Updated Description');
      expect(res.body?.route).toBe('updated-route');
    });

    it('should fail with duplicate route on update', async () => {
      // Create another simulation first
      const sim2 = await Simulation.create({
        name: 'Second Simulation',
        description: 'Second Description',
        route: 'second-simulation'
      });

      const res = await request(app)
        .put(`/simulations/${testSimulation._id}`)
        .set('Authorization', adminToken)
        .send({ 
          name: 'Updated Name',
          description: 'Updated Description',
          route: 'second-simulation' // Same as sim2
        });
      
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Route already exists');
    });

    it('should not allow non-admin to update', async () => {
      const res = await request(app)
        .put(`/simulations/${testSimulation._id}`)
        .set('Authorization', userToken)
        .send({ 
          name: 'Updated Name' 
        });
      
      expect(res.status).toBe(403);
    });

    it('should not update deleted simulation', async () => {
      const res = await request(app)
        .put(`/simulations/${deletedSimulation._id}`)
        .set('Authorization', adminToken)
        .send({ 
          name: 'Updated Name',
          description: 'Updated Description',
          route: 'updated-route'
        });
      
      expect(res.status).toBe(404);
    });

    it('should validate route format on update', async () => {
      const res = await request(app)
        .put(`/simulations/${testSimulation._id}`)
        .set('Authorization', adminToken)
        .send({ 
          name: 'Updated Name',
          description: 'Updated Description',
          route: 'invalid route'
        });
      
      expect(res.status).toBe(422);
    });

    it('should validate data types', async () => {
      const res = await request(app)
        .put(`/simulations/${testSimulation._id}`)
        .set('Authorization', adminToken)
        .send({ 
          name: 123 
        });
      
      expect(res.status).toBe(422);
    });
  });

  describe('DELETE /simulations/:id - Soft Delete Simulation', () => {
    it('should soft delete a simulation as admin', async () => {
      const res = await request(app)
        .delete(`/simulations/${testSimulation._id}`)
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Simulation moved to recycle bin');
      
      // Verify it's soft deleted
      const sim = await Simulation.findById(testSimulation._id);
      expect(sim.isDeleted).toBe(true);
      expect(sim.deletedAt).toBeDefined();
    });

    it('should not allow non-admin to delete', async () => {
      const res = await request(app)
        .delete(`/simulations/${testSimulation._id}`)
        .set('Authorization', userToken);
      
      expect(res.status).toBe(403);
    });

    it('should not delete already deleted simulation', async () => {
      const res = await request(app)
        .delete(`/simulations/${deletedSimulation._id}`)
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(404);
    });

    it('should return 404 for non-existent simulation', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/simulations/${fakeId}`)
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(404);
    });
  });

  describe('GET /simulations/bin/all - Get Recycle Bin', () => {
    it('should get all deleted simulations as admin', async () => {
      const res = await request(app)
        .get('/simulations/bin/all')
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Deleted Simulation');
      expect(res.body[0].route).toBe('deleted-simulation');
    });

    it('should not allow non-admin to view recycle bin', async () => {
      const res = await request(app)
        .get('/simulations/bin/all')
        .set('Authorization', userToken);
      
      expect(res.status).toBe(403);
    });
  });

  describe('POST /simulations/bin/restore/:id - Restore Simulation', () => {
    it('should restore a deleted simulation as admin', async () => {
      const res = await request(app)
        .post(`/simulations/bin/restore/${deletedSimulation._id}`)
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Simulation restored successfully');
      
      // Verify it's restored
      const sim = await Simulation.findById(deletedSimulation._id);
      expect(sim.isDeleted).toBe(false);
      expect(sim.deletedAt).toBe(null);
    });

    it('should not restore non-deleted simulation', async () => {
      const res = await request(app)
        .post(`/simulations/bin/restore/${testSimulation._id}`)
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(404);
    });

    it('should not allow non-admin to restore', async () => {
      const res = await request(app)
        .post(`/simulations/bin/restore/${deletedSimulation._id}`)
        .set('Authorization', userToken);
      
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /simulations/bin/:id - Permanently Delete', () => {
    it('should permanently delete a simulation from recycle bin', async () => {
      const res = await request(app)
        .delete(`/simulations/bin/${deletedSimulation._id}`)
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Simulation permanently deleted');
      
      // Verify it's gone
      const sim = await Simulation.findById(deletedSimulation._id);
      expect(sim).toBe(null);
    });

    it('should not delete non-deleted simulation', async () => {
      const res = await request(app)
        .delete(`/simulations/bin/${testSimulation._id}`)
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(404);
    });

    it('should not allow non-admin to permanently delete', async () => {
      const res = await request(app)
        .delete(`/simulations/bin/${deletedSimulation._id}`)
        .set('Authorization', userToken);
      
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /simulations/bin/empty/all - Empty Recycle Bin', () => {
    it('should empty entire recycle bin as admin', async () => {
      // Create another deleted simulation
      await Simulation.create({
        name: 'Another Deleted',
        description: 'Another Deleted Description',
        route: 'another-deleted',
        isDeleted: true,
        deletedAt: new Date()
      });

      const res = await request(app)
        .delete('/simulations/bin/empty/all')
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Recycle bin emptied successfully');
      
      // Verify bin is empty
      const deletedSims = await Simulation.find({ isDeleted: true });
      expect(deletedSims.length).toBe(0);
    });

    it('should handle empty recycle bin gracefully', async () => {
      // Clear the bin first
      await Simulation.deleteMany({ isDeleted: true });
      
      const res = await request(app)
        .delete('/simulations/bin/empty/all')
        .set('Authorization', adminToken);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Recycle bin emptied successfully');
    });

    it('should not allow non-admin to empty recycle bin', async () => {
      const res = await request(app)
        .delete('/simulations/bin/empty/all')
        .set('Authorization', userToken);
      
      expect(res.status).toBe(403);
    });
  });
});