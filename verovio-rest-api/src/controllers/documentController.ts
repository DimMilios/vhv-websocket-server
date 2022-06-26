import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { dashboardDocuments } from '../util/format';
import prisma from '../config/db-client';

async function createDocument(req: any, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  let documents = req.user?.documents;

  if (!errors.isEmpty()) {
    res.render(
      'dashboard',
      dashboardDocuments(documents, req.user.email, errors)
    );
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
}

async function deleteById(req: Request, res: Response, next: NextFunction) {
  const docId = parseInt(req.params.docId, 10);
  console.log({ docId });

  try {
    await prisma.document.delete({ where: { id: docId } });
    return res
      .status(200)
      .json({ msg: `Document of id: ${docId} has been deleted` });
  } catch (error) {
    console.log('Could not deleted document with id ', docId, error);
    next(error);
  }
}
async function updateById(req: any, res: Response, next: NextFunction) {
  const docId = parseInt(req.params.docId, 10);
  console.log({ docId });

  try {
    const updatedDoc = await prisma.document.update({
      data: {
        title: req.body.title,
      },
      where: {
        id: docId,
      },
    });
    console.log(`Updated document: ${JSON.stringify(updatedDoc, null, 2)}`);
    let documents = req.user?.documents;

    res.render('dashboard', dashboardDocuments(documents, req.user.email));
  } catch (error) {
    console.log('Could not deleted document with id ', docId, error);
    next(error);
  }
}
export default {
  createDocument,
  deleteById,
  updateById,
};
