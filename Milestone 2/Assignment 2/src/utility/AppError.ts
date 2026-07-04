/**
 * Custom application error class for consistent, type-safe error handling.
 * Extends the native Error with an HTTP status code.
 */
class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;
