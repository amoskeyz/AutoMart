import express from 'express';
import carController from '../controllers/carController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const carRouter = express();
carRouter.post('/car/', authenticator.authenticateUser, validator.validateCar, carController.postAds);
carRouter.patch('/car/:carId/status', authenticator.authenticateUser, carController.markSold);
carRouter.patch('/car/:carId/price', authenticator.authenticateUser, validator.validateUpdateCar, carController.updateCar);
carRouter.get('/car/:carId/', authenticator.authenticateUser, carController.specificCar);
carRouter.get('/car', authenticator.authenticateUser, validator.validateGetCar, carController.car);
carRouter.post('/flag/:carId', authenticator.authenticateUser, validator.validateFlag, carController.flagCar);


export default carRouter;
