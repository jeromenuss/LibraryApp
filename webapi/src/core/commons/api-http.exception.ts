import {IntrinsicException} from "@nestjs/common/exceptions/intrinsic.exception";
import {HttpException} from "@nestjs/common";

export class ApiHttpException extends Error {
    codeError:string;

    constructor(code:string){
        super(`Erreur technique : ${code}`);
        this.codeError = code;
    }
}