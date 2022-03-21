import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import prisma from '../../config/db-client';
import { requireAuth } from '../../middleware/auth';
import { documentCreateRules } from '../../middleware/validators';
import { dashboardDocuments } from '../../util/format';
export const router = express.Router();

// router.get('/:documentId', async (req, res) => {
//   const documentId = req.params.documentId;

//   const document = await prisma.document.findFirst({
//     include: { comments: true },
//     where: { id: Number(documentId) },
//   });
//   res.json(document);
// });

router.post(
  '/',
  requireAuth,
  ...documentCreateRules,
  expressAsyncHandler(async (req: any, res, next) => {
    const errors = validationResult(req);
    let documents = req.user?.documents;

    if (!errors.isEmpty()) {
      res.render('dashboard', dashboardDocuments(documents, req.user.email, errors));
      return;
    }

    const title = req.body['document-title'];
    const user = req.user;
    console.log({ title, user });

    const createdDoc = await prisma.document.create({
      data: {
        title,
        users: { connect: { id: req.user.id } },
      },
    });
    console.log('Created doc', createdDoc);

    res.redirect('/dashboard');
  })
);

router.delete('/:docId', requireAuth, async (req, res, next) => {
  const docId = parseInt(req.params.docId, 10);
  console.log({docId})

  try {
    await prisma.document.delete({ where: { id: docId }});
    return res
      .status(200)
      .json({ msg: `Document of id: ${docId} has been deleted` });
  } catch (error) {
    console.log('Could not deleted document with id ', docId, error);
    next(error);
  }
});

router.put('/:docId', requireAuth, async (req: any, res, next) => {
  const docId = parseInt(req.params.docId, 10);
  console.log({docId});

  try {
    const updatedDoc = await prisma.document.update({
      data: {
        title: req.body.title
      },
      where: {
        id: docId
      }
    });
    console.log(`Updated document: ${JSON.stringify(updatedDoc, null, 2)}`);
    let documents = req.user?.documents;

    res.render('dashboard', dashboardDocuments(documents, req.user.email));
  } catch (error) {
    console.log('Could not deleted document with id ', docId, error);
    next(error);
  }
})