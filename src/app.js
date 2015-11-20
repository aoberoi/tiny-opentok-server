import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

import routes from './routes';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

export default app;
