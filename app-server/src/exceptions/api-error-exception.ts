

class ApiError extends Error {
  public status: number;
  public errors: string[];
  
  constructor(status: number, message: string, errors: string[] = []) {
    super(message);
    this.status = status;
    this.errors = errors
  }
  
  //4xx
  /**
   * Ошибка в запросе.
   */
  static BadRequestError(message?: string, errors: string[] = []) {
    return new ApiError(400, message || 'Ошибка в запросе', errors)
  }
  
  /**
   * Пользователь не авторизован.
   */
  static UnauthorizedError(message?: string, errors: string[] = []) {
    return new ApiError(401, message || 'Пользователь не авторизован',errors)
  }
  
  /**
   * Требуется оплата.
   */
  static PaymentRequiredError(message?: string, errors: string[] = []) {
    return new ApiError(402, message || 'Требуется оплата',errors)
  }
  
  /**
   * Доступ запрещен.
   */
  static ForbiddenError(message?: string, errors: string[] = []) {
    return new ApiError(403, message || 'Доступ запрещен', errors)
  }
  
  /**
   * Запрашиваемый ресурс не найден.
   */
  static NotFoundError(message?: string, errors: string[] = []) {
    return new ApiError(404, message || 'Запрашиваемый ресурс не найден', errors)
  }
  
  //5xx
  
  /**
   * Непредвиденная ошибка.
   */
  static InternalServerError(message?: string, errors: string[] = []) {
    return new ApiError(500, message || 'Непредвиденная ошибка', errors)
  }
  
}

export {ApiError};
