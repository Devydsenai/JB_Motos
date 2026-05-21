export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: unknown;
  public readonly isOperational = true;

  constructor(message: string, statusCode = 400, errors?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Recurso") {
    super(`${resource} não encontrado`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(errors: unknown) {
    super("Dados inválidos", 422, errors);
  }
}
