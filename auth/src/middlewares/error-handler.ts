import { Request, Response, NextFunction } from "express";
import { CustomError } from '../errors/custom-error';

// can read docs at https://expressjs.com/en/guide/error-handling.html
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get same consistent format for all error types. The format is
  // errors : [ { message: <value>,  field(optional): <value>  }    ]

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
