import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set('trust proxy', true); //traffic is being proxied through ingress-nginx so make express trust that
//even though its coming from a proxy

app.use(json());
app.use(
  cookieSession({
    signed: false,  //to disable encryption - jwt is already encrypted - 
    //very imp to do this if different services are in different languages
    secure: true,   //cookies only used if https connection - imp ****** 
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// app.all - for any kind of method and * is for any kind of route
// generally next is needed for async error handler - this is default behaviour -  next( new NotFoundError());
// so instead to use throw with async code - we would download a new package express-async-errors
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

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