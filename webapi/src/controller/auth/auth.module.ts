import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './strategies/firebase-auth.strategy';

@Module({
  imports: [PassportModule, ProfilesModule],
  providers: [FirebaseAuthStrategy, AuthService],
  exports: [FirebaseAuthStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
