import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import appRoutes from './config/routes';
import { contentType } from './middlewares/content-type';
import { limiter } from './middlewares/rate-limit';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(contentType);
app.use(helmet());
app.use(limiter);

appRoutes(app);
