import express from 'express';
import commentController from '../../controllers/commentController';
import { requireAuth } from '../../middleware/auth';
import {
  commentCreateRules,
  commentDeleteRules,
} from '../../middleware/validators';
// import { notifySubs, subs } from './events';

export const router = express.Router();

router.get('/', commentController.getAll);
router.post(
  '/',
  requireAuth,
  ...commentCreateRules,
  commentController.createComment
);
router.delete(
  '/:commentId',
  requireAuth,
  ...commentDeleteRules,
  commentController.deleteById
);
router.delete('/', requireAuth, commentController.deleteByDocumentId);
