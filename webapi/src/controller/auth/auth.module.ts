import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthController} from "./auth.controller";
import {ProfilesModule} from "../profiles/profiles.module";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import {PassportModule} from "@nestjs/passport";
import {FirebaseAuthStrategy} from "./strategies/firebase-auth.strategy";
import {ProfilesService} from "../profiles/profiles.service";

@Module({
    imports: [PassportModule, ProfilesModule],
    providers: [FirebaseAuthStrategy, AuthService],
    exports: [FirebaseAuthStrategy, AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
