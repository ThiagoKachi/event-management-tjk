import { CustomError } from '@presentation/errors/custom-error';
import { serverError } from '@presentation/helpers/http/http-helper';

export const handleError = (error: unknown) => {
  if (error instanceof CustomError) {
    return {
      statusCode: error.statusCode,
      body: { message: error.message }
    };
  }

  console.error(error);

  return serverError(error as Error);
};
