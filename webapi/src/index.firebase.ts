import * as functions from 'firebase-functions';
import Container from './Container';
import cors from 'cors';

//const expressServer = express();
/*const createFunction = async (expressInstance): Promise<void> => {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressInstance),
    );
    await app.init();
};*/
export const api = functions.https.onRequest(
  { cors: ['library-app-20329.web.app', 'localhost'] },
  async (request, response) => {
    const app = await Container.getInstance().getExpress();

    app(request, response);
  },
);
