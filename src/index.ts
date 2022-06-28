import { Server } from 'ws';
import { setupWSConnection } from './config/websocket/wsUtils';
import { app, sessionParser } from './server';

// Init the global prisma client variable (imports fail for common js files)
import prisma from './config/db-client';

const PORT = process.env.PORT ?? 3001;
const server = app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});

const wss = new Server({ noServer: true });

wss.on('connection', setupWSConnection(prisma));
server.on('upgrade', (request: any, socket, head) => {
  // @ts-ignore
  sessionParser(request, {}, () => {
    if (
      !request.session ||
      !request.session.passport ||
      !request.session.passport.user
    ) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  });
});
