import express from 'express';
import carController from '../controllers/carController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const carRouter = express();
carRouter.post('/car/', authenticator.authenticateUser, validator.validateCar, carController.postAds);


export default carRouter;