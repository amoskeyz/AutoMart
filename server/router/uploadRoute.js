import express from 'express';
import { uploadController } from '../controllers/uploadController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const uploadRouter = express();
uploadRouter.post('/upload', authenticator.authenticateUser, authenticator.isRegularUser, validator.validateImage, uploadController.upload);

export default uploadRouter;
