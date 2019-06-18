import express from 'express';
import orderController from '../controllers/orderController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const orderRouter = express();
orderRouter.post('/order/:id', authenticator.authenticateUser, validator.validateOrder, orderController.purchaseOrder);

export default orderRouter;
