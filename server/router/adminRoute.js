import express from 'express';
import adminController from '../controllers/adminContoller';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const adminRouter = express();

adminRouter.delete('/car/:carId', authenticator.authenticateUser, authenticator.isAdmin, validator.validateCarId, adminController.deleteCar);

export default adminRouter;
