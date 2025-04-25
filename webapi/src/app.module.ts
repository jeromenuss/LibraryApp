import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {BooksModule} from "./controller/books/books.module";
import {ProfilesModule} from "./controller/profiles/profiles.module";
import {BorrowsModule} from "./controller/borrows/borrows.module";
import {AuthModule} from "./controller/auth/auth.module";
import {APP_GUARD} from "@nestjs/core";
import {ConfigModule, ConfigService} from '@nestjs/config'
import { FirebaseModule } from './firebase/firebase.module';
import * as admin from "firebase-admin";

@Module({
  imports: [
      ConfigModule.forRoot({cache:true}),
      FirebaseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService:ConfigService) => {
              const projectId = configService.get<string>('FIREBASE_PROJECT_ID');
              const clientEmail = configService.get<string>('FIREBASE_CLIENT_EMAIL');
              const privateKey = configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

              return {credential: admin.credential.cert({
                  projectId: projectId,
                  clientEmail : clientEmail,
                  privateKey : privateKey,
                })
              };
          }
      }),
      BooksModule, ProfilesModule, BorrowsModule, AuthModule
  ],
  controllers: [AppController],
  providers: [
      AppService,
  ],
})
export class AppModule {

}
