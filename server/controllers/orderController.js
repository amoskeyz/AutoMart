import utilities from '../helper/utilities';
import dbMethods from '../db/migrations/dbMethods';

class orderController {
  static async purchaseOrder(req, res) {
    try {
      const { id } = req.user;
      const car_id = Number(req.body.car_id);

      const isCar = await dbMethods.readFromDb('cars', '*', { id: car_id });

      if (!isCar[0]) return utilities.errorstatus(res, 404, 'Car Not Found');

      const { amount } = req.body;
      const status = 'pending';
      const buyer_id = id;
      const { price } = isCar[0];
      const orderCreated = await dbMethods.insertToDb('orders', {
        buyer_id, car_id, status, price, price_offered: amount,
      }, 'RETURNING id, created_on, car_id, buyer_id, status, price, price_offered');

      return utilities.successStatus(res, 201, 'data', orderCreated);
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async updatePurchase(req, res) {
    try {
      const { id } = req.user;
      const { price } = req.body;
      const { orderId } = req.params;
      const new_price_offered = price;

      const isOrder = await dbMethods.readFromDb('orders', '*', { id: Number(orderId) });

      if (!isOrder[0]) return utilities.errorstatus(res, 400, 'Purchase Order Not found');

      if (isOrder[0].status === 'pending') {
        if (Number(isOrder[0].buyer_id) !== id) return utilities.errorstatus(res, 400, 'You Are not allowed to perform this action');

        if (isOrder[0].old_price_offered === null) {
          await dbMethods.updateDbRow('orders', { old_price_offered: isOrder[0].price_offered }, { id: Number(orderId) });
        } else await dbMethods.updateDbRow('orders', { old_price_offered: isOrder[0].new_price_offered }, { id: Number(orderId) });

        await dbMethods.updateDbRow('orders', { new_price_offered }, { id: Number(orderId) });

        const update = await dbMethods.readFromDb('orders', '*', { id: Number(orderId) });

        delete update[0].price_offered;

        return utilities.successStatus(res, 200, 'data', update[0]);
      } return utilities.errorstatus(res, 400, 'Purchase Order Already Approved');
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }
}

export default orderController;
