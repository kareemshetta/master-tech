export class AppError extends Error {
  statusCode: number;
  status: string;
  replacer?: string;

  constructor(message: string, statusCode: number, replacer?: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.replacer = replacer;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    this.status = " validation error";

    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnprocessableEntityError extends Error {
  statusCode: number;

  constructor(message: string = "Un processable Entity Error") {
    super(message);
    this.statusCode = 422;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
