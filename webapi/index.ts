import express, {request, response} from 'express';
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./src/app.module";
import {ExpressAdapter} from "@nestjs/platform-express";
import * as functions from 'firebase-functions';

const expressServer = express()

const createFunction = async(expressInstance) :Promise<void> => {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressInstance),
    );
    await app.init();
};

export const api = functions.https.onRequest(async (request, response) => {
    await createFunction(expressServer);
    expressServer(request, response);
})