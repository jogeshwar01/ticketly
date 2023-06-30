import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signin: () => Promise<string[]>;
  // the cookie is an array of strings so promise also same
}
// doing global just for ease of use - can create a auth Helper separately and import wherever needed also
// this wont be available in our normal app code so only for testing environment

let mongo: any;

//this will run before all our tests start to run
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  // we need to write this as our env variables should exists for tests as well

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

//this will run before each of our test - reset data in mongo
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// done to make code modular and reusable
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  // we need to add cookie data manually in supertest unlike postman and browser
  const cookie = response.get('Set-Cookie');

  return cookie;
};
