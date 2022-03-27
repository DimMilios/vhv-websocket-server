import express from 'express';
import prisma from '../../config/db-client';
import { requireAuth } from '../../middleware/auth';

import { URL } from 'url';
import { dashboardDocuments } from '../../util/format';

export const router = express.Router();

// Find all users for a document
router.get('/', requireAuth, async (req, res, next) => {
  const docId = Number(req.query.docId);

  try {
    const users = await prisma.user.findMany({
      where: {
        documents: {
          some: { id: docId },
        },
      },
      select: { id: true, name: true, email: true, imageProfileURL: true },
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
});


// Sent from the inviter
// /api/users/invite/invitee_email
router.post('/invite/:email', requireAuth, async (req: any, res, next) => {
  const email = req.params.email;
  const documentId = Number(req.body.documentId);
  // Check that a user with that email is registered.
  // Check if user with that email already has access to the document.

  try {
    const invitation = await prisma.pendingInvitations.create({
      data: {
        email,
        documentId,
      },
      include: {
        document: true,
      },
    });

    const inviteURL = new URL(req.protocol + '://' + req.get('host') + req.baseUrl + '/join');
    // inviteURL.pathname = '/join';
    inviteURL.searchParams.append('email', email);
    inviteURL.searchParams.append('docId', invitation.documentId.toString());
    inviteURL.searchParams.append('docTitle', invitation.document.title);

    res
      .status(201)
      .json({
        inviteURL: inviteURL.toString(),
        createdAt: invitation.createdAt,
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/join', requireAuth, async (req, res, next) => {
  let { email, docId } = req.query;

  console.log(req.query);

  try {
    email = email?.toString();
    if (email) {
      const [,,invited] = await prisma.$transaction([
        prisma.pendingInvitations.findFirst({
          where: { email, documentId: Number(docId), accepted: false }
        }),  
        prisma.pendingInvitations.updateMany({
          where: { email, documentId: Number(docId) },
          data: {
            accepted: true
          }
        }), 
        prisma.user.update({
          data: {
            documents: { connect: { id: Number(docId) } },
          },
          where: { email: email?.toString() },
          include: { documents: { include: { users: true }} }
        }),
      ]);
  
      if (invited) {
        res.render('dashboard', dashboardDocuments(invited.documents, email));
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});