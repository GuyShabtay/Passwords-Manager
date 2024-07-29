import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/UserModel.js';
import { AccountDetails } from '../models/AccountDetailsModel.js';
import router from '../routes.js'; // Adjust the path accordingly
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', router);

const TEST_DB_URI = process.env.MONGODB_URL; // Change this to your test DB URI
const TOKEN_KEY = process.env.TOKEN_KEY; // Change this to your test token key

// Setup and teardown for database connection
beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('User API', () => {
  let token;
  let testUser = {
    userName: 'testUser',
    email: 'testuser@example.com',
    password: 'password123'
  };

  let testCredential = {
    website: 'example.com',
    password: 'mySecretPassword'
  };

  // Test user registration
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send(testUser);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(testUser.email);
  });

  // Test user login
  it('should login a user and return a token', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });

  // Test creating credentials
  it('should create new credentials for the user', async () => {
    const response = await request(app)
      .post('/api/credentials')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testCredential, email: testUser.email });

    expect(response.status).toBe(200);
    expect(response.body.credentials).toHaveLength(1);
  });

  // Test editing credentials
  it('should update credentials', async () => {
    const credentials = await AccountDetails.findOne({ email: testUser.email });
    const credentialId = credentials.credentials[0]._id;

    const updatedCredential = {
      website: 'updated-example.com',
      password: 'newSecretPassword'
    };

    const response = await request(app)
      .put(`/api/credentials/${credentialId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: testUser.email, ...updatedCredential });

    expect(response.status).toBe(200);
    expect(response.body.credentials[0].website).toBe(updatedCredential.website);
  });

  // Test deleting credentials
  it('should delete credentials', async () => {
    const credentials = await AccountDetails.findOne({ email: testUser.email });
    const credentialId = credentials.credentials[0]._id;

    const response = await request(app)
      .delete(`/api/credentials/${credentialId}`)
      .set('Authorization', `Bearer ${token}`)
      .query({ email: testUser.email });

    expect(response.status).toBe(200);
    expect(response.body.credentials).toHaveLength(0);
  });
});
