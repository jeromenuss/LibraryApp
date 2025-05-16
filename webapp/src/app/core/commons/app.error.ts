export class AppError implements Error{
    code!:string;

    name!: string;
    message!: string;
    stack?: string | undefined;
    cause?: unknown;

}
