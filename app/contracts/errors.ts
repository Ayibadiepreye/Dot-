export class AppError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode: number = 400) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const Errors = {
  forbidden: (msg = "Access denied") => new AppError("FORBIDDEN", msg, 403),
  unauthorized: (msg = "Authentication required") => new AppError("UNAUTHORIZED", msg, 401),
  badRequest: (msg = "Invalid request") => new AppError("BAD_REQUEST", msg, 400),
  notFound: (msg = "Not found") => new AppError("NOT_FOUND", msg, 404),
  conflict: (msg = "Conflict") => new AppError("CONFLICT", msg, 409),
  internal: (msg = "Internal server error") => new AppError("INTERNAL", msg, 500),
};
