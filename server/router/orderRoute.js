import express from 'express';
import orderController from '../controllers/orderController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const orderRouter = express();
orderRouter.post('/order/:id', authenticator.authenticateUser, validator.validateOrder, orderController.purchaseOrder);
orderRouter.patch('/order/:orderId/price', authenticator.authenticateUser, validator.validateUpdateOrder, orderController.updatePurchase);

export default orderRouter;
