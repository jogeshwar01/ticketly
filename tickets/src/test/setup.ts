import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
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

// to get cookie - fake signin for tests by creating dummy user and generating jwt
global.signin = () => {
  // Build a JWT payload. { id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),  //random id everytime
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64 - this is just needed - learn syntax
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`]; // array as supertest likes it
};
