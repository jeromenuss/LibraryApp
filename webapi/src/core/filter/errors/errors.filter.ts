import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import {ErrorMessage} from "../../commons/error-message.commons";
import {ApiHttpException} from "../../commons/api-http.exception";

@Catch()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse();
    const request: any = ctx.getRequest();

    //Erreur par défaut
    let status = 500;

    console.log(exception);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.humanizeErrorMessage(exception, status),
    });
  }

  private humanizeErrorMessage(exception:any, statusCode:number){
    const errorCode = this.getErrorCodeFromException(exception);

    return ErrorMessage[errorCode] || this.getDefaultMessageForStatus(statusCode);
  }

  private getErrorCodeFromException(excepion:ApiHttpException){
    if(excepion instanceof ApiHttpException){
      return excepion.codeError;
    } else {
      return "";
    }
  }

  private getDefaultMessageForStatus(statusCode:number){
    switch(statusCode) {
      case 400:
        return "Les informations fournies ne sont pas valides. Vérifiez vos données et réessayez";
      case 401:
        return "Vous devez vous connecter pour accéder à cette fonctionnalité";
      case 403:
        return "Vous n'avez pas l'autorisation d'effectuer cette action";
      case 404:
        return "L'élément que vous recherchez n'est pas disponible";
      case 409:
        return "Cette opération ne peut être effectuée car elle crée un conflit";
      case 422:
        return "Les données fournies ne peuvent pas être traitées";
      case 429:
        return "Vous avez effectué trop de requêtes. Veuillez patienter avant de réessayer";
      default:
        return "Une difficulté technique est survenue. Notre équipe a été notifiée";
    }
  }
}
