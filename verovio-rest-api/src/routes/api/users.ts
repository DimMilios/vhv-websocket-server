import express from 'express';
import { requireAuth } from '../../middleware/auth';
import userController from '../../controllers/userController';

export const router = express.Router();

// Find all users for a document
router.get('/', requireAuth, userController.findUsersForDocument);

// Sent from the inviter
// /api/users/invite/invitee_email
router.post('/invite/:email', requireAuth, userController.inviteUserByEmail);

router.get('/join', requireAuth, userController.joinInvitation);
