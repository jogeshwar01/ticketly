import express from "express";
import 'express-async-errors';
import { json } from "body-parser";

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// app.all - for any kind of method and * is for any kind of route
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// app.all("*",async (req,res,next) => {
//   next( new NotFoundError());
// });
// next is needed for async error handler - this is default behaviour
// so instead to use throw with async code - we would download a new package express-async-errors

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
