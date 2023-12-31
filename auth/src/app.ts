import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from "@js-ticketly/common";

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
app.set('trust proxy', true); //traffic is being proxied through ingress-nginx so make express trust that
//even though its coming from a proxy

app.use(json());
app.use(
  cookieSession({
    signed: false,  //to disable encryption - jwt is already encrypted - 
    //very imp to do this if different services are in different languages
    secure: process.env.NODE_ENV !== 'test'   //cookies only used if https connection if secure:true -> imp ****** 
    // when we use supertest  library for test - it only uses http - so we need to do this to make it work
    // whenver jest runs, the NODE_ENV variable is set to 'test'
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

export { app };
// this works as supertest will automatically assign an ephemeral(random) port, so we wont listen here but rather in index.js
// so that we can keep our app without any port - this could be used for testing - this will be helpful in avoiding port conflict bw
// different services while testing as if we kept app.listen here then 2 services may clash at the same port