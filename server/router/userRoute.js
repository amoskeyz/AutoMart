import express from 'express';
import userController from '../controllers/userController';
import validator from '../middleware/validator';

const router = express();
router.get('/', userController.welcome);
router.post('/auth/signup', validator.validateSignup, userController.signupUser);

export default router;
