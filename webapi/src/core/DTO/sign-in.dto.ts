import {ApiProperty} from "@nestjs/swagger";
import {z} from "zod";

export class SignInDtoOld{
    @ApiProperty()
    email:string;
    @ApiProperty()
    password:string;
}

export const signInSchema = z
    .object({
        email:z.string().email("L'adresse mail n'est pas valide"),
        password:z.string()
    })
    .required();

export type SignInDto = z.infer<typeof signInSchema>;