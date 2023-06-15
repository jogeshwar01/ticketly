import { ValidationError } from "express-validator";
// type of object returned by express-validator is ValidationError

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    // Only because we are extending a built in class ie. Error
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
