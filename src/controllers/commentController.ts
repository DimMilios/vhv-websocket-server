import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/db-client';

async function getAll(_req: Request, res: Response) {
  const comments = await prisma.comment.findMany();
  res.status(200).json(comments);
}

async function createComment(req: any, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json(JSON.stringify(errors.array()));
  }

  const {
    content,
    parentCommentId,
    clientId,
    documentId,
    multiSelectElements,
  } = req.body;
  const userId = req.user.id;

  try {
    const createdComment = await prisma.comment.create({
      data: {
        content,
        // parentCommentId,
        multiSelectElements,
        usersDocuments: { create: { userId, documentId } },
        parentComment: !parentCommentId
          ? undefined
          : { connect: { id: parentCommentId } },
      },
      include: {
        usersDocuments: {
          select: {
            user: true,
            commentId: true,
            documentId: true,
            createdAt: true,
          },
        },
      },
    });

    console.log('Created comment', createdComment);

    res.status(201).json(createdComment);

    // notifySubs(subs, clientId, documentId, { type: 'comments:create', createdComment });
  } catch (error) {
    console.log(error);
    res.status(400).json('Something went wrong');
  }
}

async function deleteById(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json(JSON.stringify(errors.array()));
  }

  const { userId, documentId, clientId } = req.body;
  const commentId = req?.params?.commentId;
  console.log('DELETE /api/comments/:commentId', {
    commentId,
    userId,
    documentId,
    clientId,
    sessionUser: req.user,
  });

  try {
    const result = await prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    if (!result) {
      return res
        .status(400)
        .json({ error: `Could not delete comment with id ${commentId}` });
    }

    // notifySubs(subs, clientId, documentId, { type: 'comments:delete', ids: [commentId] });
    return res
      .status(200)
      .json({ msg: `Comment of id: ${commentId} has been deleted` });
  } catch (error) {
    console.log('Could not delete comment with id ', commentId, error);
    next(error);
  }
}

async function deleteByDocumentId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { documentId, clientId } = req.body;

  try {
    const doc = await prisma.document.findFirst({
      where: { id: Number(documentId) },
      select: { usersComments: { select: { commentId: true } } },
    });

    await prisma.comment.deleteMany({
      where: { usersDocuments: { every: { documentId: Number(documentId) } } },
    });

    // notifySubs(subs, clientId, documentId, { type: 'comments:delete', ids: doc?.usersComments.map(uc => uc.commentId) });
    return res.status(200).json({
      msg: `Comments for document with id: ${documentId} have been deleted`,
    });
  } catch (error) {
    console.log(
      'Could not delete comments for document with id',
      documentId,
      error
    );
    next(error);
  }
}

export default {
  getAll,
  createComment,
  deleteById,
  deleteByDocumentId,
};
