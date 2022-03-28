import express from 'express';
import { query, validationResult } from 'express-validator';
import prisma from '../../config/db-client';
import { requireAuth } from '../../middleware/auth';
import { Subscriber } from '../../types';

export const router = express.Router()

// TODO: move subs to the request session object
export let subs: Subscriber[] = [];

router.get('/comments',
  requireAuth,
  query('docId').notEmpty().isInt().toInt(),
  query('clientId').notEmpty().isInt().toInt(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json(JSON.stringify(errors.array()));
    }

    let docId = parseInt(req?.query?.docId as string, 10);
    let clientId = parseInt(req?.query?.clientId as string, 10);
    // let userId = req.user?.id ?? 1;
    
    docId = Number(docId);
    subs.push({ clientId, docId, res });

    res.writeHead(200, {
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream',
    });

    // req.on('close', () => {
    //   console.log(`${clientId} Connection closed`);
    //   subs = subs.filter(sub => sub.clientId === clientId);
    // });

    try {
      // Send existing comments for this document
      const comments = await prisma.comment.findMany({
        where: {
          usersDocuments: { every: { documentId: docId } },
        },
        include: {
          usersDocuments: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
          // user: { select: { id: true, name: true, email: true } },
        },
      });
  
      res.write(`data: ${JSON.stringify(comments)}\n\n`);
    } catch(error) {
      console.log(error);
      next(error);
    }
    // res.write(`data: ${JSON.stringify({ docId, userId, subs })}\n\n`);
})

export function notifySubs(subs: Subscriber[], clientId: number, docId: number, msg: any) {
  if (subs) {
    // Sending message to all subs
    // console.log({ subs, senderClientId: clientId, docId, msg });

    // Only send messages to clients listening to the given document id
    subs.filter((sub: Subscriber) => sub.clientId != clientId && sub.docId == docId)
      .forEach((sub: Subscriber) => {
        // console.log('Sub', { clientId: sub.clientid, docId: sub.docId, usersIds: sub.usersIds }, 'sending', msg);
        sub.res?.write(`data: ${JSON.stringify(msg)}\n\n`);
      })
  }
}