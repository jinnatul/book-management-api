import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';
    let error: string = 'Internal Server Error';

    if (this.isHttpException(exception)) {
      // Now TS knows exception is HttpException here, no assertion needed
      status = exception.getStatus();
      const responseContent = exception.getResponse();

      if (typeof responseContent === 'string') {
        message = responseContent;
        error = HttpStatus[status] ?? 'Error';
      } else if (
        responseContent !== null &&
        typeof responseContent === 'object'
      ) {
        const resObj = responseContent as ExceptionResponse;

        if (Array.isArray(resObj.message)) {
          message = resObj.message.join(', ');
        } else if (typeof resObj.message === 'string') {
          message = resObj.message;
        }

        error = resObj.error ?? HttpStatus[status] ?? 'Error';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    } else if (typeof exception === 'string') {
      message = exception;
    } else {
      message = JSON.stringify(exception);
    }

    this.logger.error(
      `${request.method} ${request.url} [${status}]: ${message}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }

  // Strongly typed type guard: ensures exception is HttpException
  private isHttpException(exception: unknown): exception is HttpException {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      typeof (exception as HttpException).getStatus === 'function' &&
      typeof (exception as HttpException).getResponse === 'function'
    );
  }
}
