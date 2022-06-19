import dotenv from 'dotenv/config';

import express from 'express';
import type { ErrorRequestHandler } from 'express';
import session from 'express-session';
import passport from 'passport';
import './config/passport';
import cors from 'cors';

import path from 'path';
import { router as indexRouter } from './routes';
import { router as authRouter } from './routes/auth';
import { router as commentsRouter } from './routes/api/comments';
import { router as documentsRouter } from './routes/api/documents';
import { router as userRouter } from './routes/api/users';
import { router as dashboardRouter } from './routes/dashboard';

import CustomError from './util/error';
import { requireAuthWithPath } from './middleware/auth';
import { router as eventsRouter } from './routes/api/events';

export const app = express();
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors({ origin: '*', credentials: true }));

app.use(express.static('public'));
app.use(express.static('public-client'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export let sessionParser = session({
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  name: 'auth',
  secret: 'verysecuresecret',
  resave: true,
  saveUninitialized: true,
});
app.use(sessionParser);
app.use(passport.initialize());
app.use(passport.session());

const CLIENT_PATH = '/client';
app.use(requireAuthWithPath(CLIENT_PATH));
app.use(CLIENT_PATH, express.static('client'));

app.get('/ping', async (_req, res) => {
  return res.status(200).json({
    message: 'pong',
  });
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/events', eventsRouter);

app.use('/api/users', userRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/documents', documentsRouter);

app.get('/not-found', (req, res) => {
  return res.render('error', {
    message: 'Resource not found',
  });
});

app.get('*', (req, res, next) => {
  const error = new CustomError(
    301,
    `${req.ip} tried to access ${req.originalUrl}`
  );
  next(error);
});

let errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (!error.statusCode) {
    error.statusCode = 500;
  }

  if (error.statusCode === 301) {
    return res.status(301).redirect('/not-found');
  }

  return res.status(error.statusCode).json({ error: error.toString() });
};
app.use(errorHandler);
