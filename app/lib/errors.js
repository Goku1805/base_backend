const ErrorType = {
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
}

class AppError {
  constructor(args) {
    const defaults = {
      name: 'AppError',
      statusCode: 400,
      type: ErrorType.DANGER,
      message: 'Error Occured',
      generatedBy: 'AppError',
      instance: null,
    };

    this.error = Object.assign({}, defaults, args);
  }

  json() {
    let error = {...this.error};
    delete error.generatedBy;
    return {
      error: error,
    }
  }

  getCode() {
    return this.statusCode;
  }
}

const errorResponse = (res, e) => {

  if(e.error && e.error.generatedBy === 'AppError') {
    return res.status(e.error.statusCode).json(e.json());
  }

  if(
      e.name === 'SequelizeValidationError' ||
      e.name === 'SequelizeUniqueConstraintError'
    ) {
    let m = e.errors.map(e => e.message).join('\n');
    return res.status(400).json(
      new AppError({
        name: 'ValidationError',
        message: m,
        instance: e.errors.map(e => e.message)
      }).json()
    );
  }
  return res.status(401).json(
    new AppError({
      name: e.name,
      message: e.message,
      instance: e
    }).json()
  );
}

export {
  ErrorType,
  AppError,
  errorResponse
}
