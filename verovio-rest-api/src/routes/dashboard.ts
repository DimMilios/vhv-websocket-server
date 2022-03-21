import express from 'express';
import { requireAuth } from '../middleware/auth';
import { dashboardDocuments } from '../util/format';
export const router = express.Router();

router.get('/', requireAuth, (req: any, res) => {
  let documents = req.user?.documents;

  if (Array.isArray(documents) && documents.length > 0) {
    res.render('dashboard', dashboardDocuments(documents, req.user.email));
    return;
  }

  res.render('dashboard');
});
