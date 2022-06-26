import express from 'express';
import { loginRules, userCreateRules } from '../middleware/validators';
import userController from '../controllers/userController';

export const router = express.Router();

router.get('/login', userController.getLogin);
router.post('/login', ...loginRules, userController.postLogin);
router.post('/logout', userController.logout);
router.get('/signUp', userController.getSignUp);
router.post('/signUp', ...userCreateRules, userController.postSignUp);
