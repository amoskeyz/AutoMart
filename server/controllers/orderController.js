import utilities from '../helper/utilities';
import dbMethods from '../db/migrations/dbMethods';

class orderController {
  static async purchaseOrder(req, res) {
    try {
      const { isAdmin, id } = req.user;
      const carId = Number(req.params.id);
      const isCar = await dbMethods.readFromDb('cars', '*', { id: carId });
      if (!isCar[0]) return utilities.errorstatus(res, 404, 'Car Not Found');
      if (!isAdmin) {
        const { priceOffered } = req.body;
        const status = 'pending';
        const buyerId = id;
        const { price } = isCar[0];
        const orderCreated = await dbMethods.insertToDb('orders', {
          buyerId, carId, status, price, priceOffered,
        }, 'RETURNING *');
        return utilities.successStatus(res, 201, 'data', orderCreated);
      }
      return utilities.errorstatus(res, 401, 'Unauthorise Access');
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }
}

export default orderController;
