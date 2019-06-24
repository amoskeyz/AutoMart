import utilities from '../helper/utilities';
import dbMethods from '../db/migrations/dbMethods';

class orderController {
  static async purchaseOrder(req, res) {
    try {
      const { id } = req.user;
      const carId = Number(req.params.id);

      const isCar = await dbMethods.readFromDb('cars', '*', { id: carId });

      if (!isCar[0]) return utilities.errorstatus(res, 404, 'Car Not Found');

      const { priceOffered } = req.body;
      const status = 'pending';
      const buyerId = id;
      const { price } = isCar[0];

      const orderCreated = await dbMethods.insertToDb('orders', {
        buyerId, carId, status, price, priceOffered,
      }, 'RETURNING id, created_on, carid, buyerid, status, price, priceoffered');

      return utilities.successStatus(res, 201, 'data', orderCreated);
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async updatePurchase(req, res) {
    try {
      const { id } = req.user;
      const { newPriceOffered } = req.body;
      const { orderId } = req.params;

      const isOrder = await dbMethods.readFromDb('orders', '*', { id: Number(orderId) });

      if (!isOrder[0]) return utilities.errorstatus(res, 400, 'Purchase Order Not found');

      if (isOrder[0].status === 'pending') {
        if (Number(isOrder[0].buyerid) !== id) return utilities.errorstatus(res, 400, 'You Are not allowed to perform this action');

        if (isOrder[0].oldpriceoffered === null) {
          await dbMethods.updateDbRow('orders', { oldpriceoffered: isOrder[0].priceoffered }, { id: Number(orderId) });
        } else await dbMethods.updateDbRow('orders', { oldpriceoffered: isOrder[0].newpriceoffered }, { id: Number(orderId) });

        await dbMethods.updateDbRow('orders', { newpriceoffered: newPriceOffered }, { id: Number(orderId) });

        const update = await dbMethods.readFromDb('orders', '*', { id: Number(orderId) });

        delete update[0].priceoffered;

        return utilities.successStatus(res, 200, 'data', update[0]);
      } return utilities.errorstatus(res, 400, 'Purchase Order Already Approved');
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }
}

export default orderController;
