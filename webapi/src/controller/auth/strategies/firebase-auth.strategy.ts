import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-firebase-jwt";
import * as admin from 'firebase-admin';
import {UnauthorizedException} from "@nestjs/common";

export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(token:string): Promise<any> {
        try{
            return await admin.auth().verifyIdToken(token);
        }catch(error){
            console.log(error);
            throw new UnauthorizedException(error);
        }
    }
}