import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {QueryFailedError} from "typeorm";
import {TypeORMError} from "typeorm/error/TypeORMError";

@Catch()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    //Erreur par défaut
    let status = 500;

    if(exception as HttpException){
        status = exception.getStatus();
    }

    response
        .status(status)
        .json({
          statusCode: status,
          timestamp:new Date().toISOString(),
          path:request.url,
          messsage: exception.message || "Erreur inconnu"
        });
  }
}
