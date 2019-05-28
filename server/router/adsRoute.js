import express from 'express';
import adsController from '../controllers/adsController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const adsRouter = express();
adsRouter.post('/cars/', authenticator.authenticateUser, validator.validateCar, adsController.postAds);
adsRouter.post('/order/:id', authenticator.authenticateUser, validator.validateOrder, adsController.purchaseOrder);
adsRouter.patch('/order/:orderId/price', authenticator.authenticateUser, validator.validateUpdateOrder, adsController.updatePurchase);
adsRouter.patch('/cars/:carId/status', authenticator.authenticateUser, adsController.markSold);

export default adsRouter;
