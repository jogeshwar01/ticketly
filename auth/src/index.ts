import mongoose from "mongoose";

import { app } from './app';

const start = async () => {
  // check if jwt key exists during app startup
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    // need to use cluster ip service to connect to mongo instance
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

start();