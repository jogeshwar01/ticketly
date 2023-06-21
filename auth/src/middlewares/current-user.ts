//middleware to extract jwt payload and set it on 'req.currentUser'
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//interface to define how our payload would look like from jwt.verify
interface UserPayload {
  id: string;
  email: string;
}

//modify existing type definition
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;  // ? - currentUser may or may not be defined - signed in or not
    }
  }
}
//had to write this above code as req inherently wouldnt have property currentUser
//so req.currentUser will give error, so we need to modify req to have it

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check whether user is logged in
  if (!req.session?.jwt) { // ? is a shortcut for !req.session || !req.session.jwt
    //req.session will be set by cookie-session
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) { }

  next();
};
