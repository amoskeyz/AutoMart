import express from 'express';
import adsController from '../controllers/adsController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const adsRouter = express();
adsRouter.post('/car/', authenticator.authenticateUser, validator.validateCar, adsController.postAds);
adsRouter.post('/order/:id', authenticator.authenticateUser, validator.validateOrder, adsController.purchaseOrder);
adsRouter.patch('/order/:orderId/price', authenticator.authenticateUser, validator.validateUpdateOrder, adsController.updatePurchase);
adsRouter.patch('/car/:carId/status', authenticator.authenticateUser, adsController.markSold);
adsRouter.patch('/car/:carId/price', authenticator.authenticateUser, validator.validateUpdateCar, adsController.updateCar);
adsRouter.get('/car/:carId/', authenticator.authenticateUser, adsController.specificCar);
adsRouter.get('/car', authenticator.authenticateUser, validator.validateGetCar, adsController.car);


export default adsRouter;
