import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import documentController from '../../controllers/documentController';
import { requireAuth } from '../../middleware/auth';
import { documentCreateRules } from '../../middleware/validators';
export const router = express.Router();

router.post(
  '/',
  requireAuth,
  ...documentCreateRules,
  expressAsyncHandler(documentController.createDocument)
);
router.delete('/:docId', requireAuth, documentController.deleteById);
router.put('/:docId', requireAuth, documentController.updateById);
