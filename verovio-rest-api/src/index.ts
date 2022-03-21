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

// Init the global prisma client variable (imports fail for common js files)
import prisma from './config/db-client';

import { Server } from 'ws';
import { setupWSConnection } from './config/websocket/wsUtils.js';
import CustomError from './util/error';
import { requireAuthWithPath } from './middleware/auth';
import { router as eventsRouter } from './routes/api/events';

const wss = new Server({ noServer: true });

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

app.use(express.static('public'));
app.use(express.static('public-client'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sessionParser = session({
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

wss.on('connection', setupWSConnection(prisma));
server.on('upgrade', (request: any, socket, head) => {
  // @ts-ignore
  sessionParser(request, {}, () => {
    // console.log('Session is parsed!');
    // console.log(JSON.stringify(request.session, null, 2));

    if (!request.session || !request.session.passport || !request.session.passport.user) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  });

  // wss.handleUpgrade(request, socket, head, ws => {
  //   wss.emit('connection', ws, request);
  // });
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
