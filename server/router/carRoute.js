import express from 'express';
import carController from '../controllers/carController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const carRouter = express();
carRouter.post('/car/', authenticator.authenticateUser, authenticator.isRegularUser, validator.validateCar, carController.postAds);
carRouter.patch('/car/:carId/status', authenticator.authenticateUser, authenticator.isRegularUser, validator.validateSold, carController.markSold);
carRouter.patch('/car/:carId/price', authenticator.authenticateUser, authenticator.isRegularUser, validator.validateUpdateCar, carController.updateCar);
carRouter.get('/car/:carId/', authenticator.authenticateUser, authenticator.isRegularUser, carController.specificCar);
carRouter.get('/car', authenticator.authenticateUser, validator.validateGetCar, carController.car);
carRouter.post('/flag/:carId', authenticator.authenticateUser, authenticator.isRegularUser, validator.validateFlag, carController.flagCar);
carRouter.patch('/cars/:car_id', authenticator.authenticateUser, authenticator.isRegularUser, carController.updateCarImage);


export default carRouter;
