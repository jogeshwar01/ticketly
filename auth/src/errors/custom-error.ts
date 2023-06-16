export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    // no need of message as such for erros - this message is just for logging purposes

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}

// abstract class to keep functionality reusable and keep type guarantees
