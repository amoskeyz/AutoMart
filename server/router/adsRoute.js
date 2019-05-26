import express from 'express';
import adsController from '../controllers/adsController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const adsRouter = express();
adsRouter.post('/cars/', authenticator.authenticateUser, validator.validateCar, adsController.postAds);

export default adsRouter;
