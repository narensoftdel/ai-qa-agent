import path from 'path';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import routes from './routes/index.js';

const app = express();

app.use(cors());

app.use(
  helmet({
    // Screenshots are embedded by the Angular app on another origin
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
);

app.use(compression());

app.use(express.json());

app.use('/storage', express.static(path.join(process.cwd(), 'storage')));

app.use('/api', routes);

export default app;
