import { DynamicModule, Module, Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule } from '@nestjs/config';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

interface FirebaseModuleAsyncOptions {
  inject?: any[];
  useFactory: (...args: any[]) => admin.AppOptions | Promise<admin.AppOptions>;
}

@Module({
  imports: [ConfigModule],
})
export class FirebaseModule {
  static forRoot(options?: admin.AppOptions) {
    const firebaseAppProvider = {
      provide: 'FIREBASE_APP',
      useFactory: () => {
        return admin.initializeApp(options);
      },
    };

    const firestoreProvider = {
      provide: 'FIRESTORE',
      useFactory: (app: admin.app.App) => {
        return getFirestore(app);
      },
      inject: ['FIREBASE_APP'],
    };

    return {
      module: FirebaseModule,
      providers: [firebaseAppProvider, firestoreProvider],
      export: [firebaseAppProvider, firestoreProvider],
      global: true,
    };
  }

  static forRootAsync(options: FirebaseModuleAsyncOptions): DynamicModule {
    const firebaseAppProvider: Provider = {
      provide: 'FIREBASE_APP',
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return admin.initializeApp(config);
      },
      inject: options.inject || [],
    };

    const firestoreProvider: Provider = {
      provide: 'FIRESTORE',
      useFactory: (app: admin.app.App) => {
        return getFirestore(app);
      },
      inject: ['FIREBASE_APP'],
    };

    return {
      module: FirebaseModule,
      providers: [firebaseAppProvider, firestoreProvider],
      exports: [firebaseAppProvider, firestoreProvider],
      global: true,
    };
  }
}
