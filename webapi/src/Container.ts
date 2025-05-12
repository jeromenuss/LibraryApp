import express, { Express } from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import cors from 'cors';

class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map<string, string>();

  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    this.services.set('express', express());
  }

  static getInstance(): Container {
    if (!Container.instance) Container.instance = new Container();

    return Container.instance;
  }

  async getExpress(): Promise<any> {
    await this.ensureInitialized();
    return this.services.get('express');
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeApp();
    }

    return this.initializationPromise;
  }

  private async initializeApp() {
    const expressApp: Express = this.services.get('express') as Express;

    //On laisse la possibilité d'accéder à l'api uniquement pour les applications appelantes. Dans les autres cas, on remonte une erreur.
    expressApp.use(
      cors({
        origin: [
          'https://library-app-20329.web.app',
          'https://library-app-20329.firebaseapp.com/home',
          'http://localhost:5000',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      }),
    );

    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    await app.init();
    this.initialized = true;
  }
}

//On l'exporte
export default Container;
