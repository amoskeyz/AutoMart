import utilities from '../helper/utilities';
import cars from '../model/cars';
import users from '../model/user';
import order from '../model/order';

class adsController {
  static postAds(req, res) {
    const userId = req.decoder;
    let email;
    users.forEach((user) => {
      if (user.id === userId) {
        ({ email } = user);
      }
    });
    if (email) {
      const {
        manufacturer, model, bodyType, price, state,
      } = req.body;
      const id = cars.length + 1;
      const status = 'Available';
      const createdOn = new Date();
      const carObj = {
        id, email, createdOn, manufacturer, model, bodyType, price, state, status,
      };
      cars.push(carObj);
      return utilities.successStatus(res, 201, 'data', carObj);
    }
    return utilities.errorstatus(res, 400, 'User Not Found');
  }

  static purchaseOrder(req, res) {
    const userId = req.decoder;
    const carId = Number(req.params.id);
    let email;
    let isCar = false;
    let price;
    users.forEach((user) => {
      if (user.id === userId) {
        ({ email } = user);
      }
    });
    cars.forEach((car) => {
      if (car.id === carId) {
        isCar = true;
        ({ price } = car);
      }
    });
    const id = order.length + 1;
    const createdOn = new Date();
    const status = 'Pending';
    const buyerId = userId;
    if (email && isCar) {
      const { priceOffered } = req.body;
      const orderObj = {
        id, buyerId, carId, createdOn, status, price, priceOffered,
      };
      order.push(orderObj);
      return utilities.successStatus(res, 201, 'data', orderObj);
    }
    return utilities.errorstatus(res, 400, 'Car or User Not Found');
  }

  static updatePurchase(req, res) {
    const userId = req.decoder;
    const { newPriceOffered } = req.body;
    const { orderId } = req.params;
    const user = users.filter(use => use.id === Number(userId));
    if (user[0]) {
      const isOrder = order.filter(orde => orde.id === Number(orderId));
      if (!isOrder[0]) return utilities.errorstatus(res, 400, 'Purchase Order Not found');
      if (isOrder[0].buyerId !== userId) return utilities.errorstatus(res, 400, 'Unauthorized user');
      const orderIndex = order.findIndex(ord => ord.id === Number(orderId));
      if (order[orderIndex].priceOffered) {
        order[orderIndex].oldPriceOffered = order[orderIndex].priceOffered;
      } else order[orderIndex].oldPriceOffered = order[orderIndex].newPriceOffered;
      order[orderIndex].newPriceOffered = newPriceOffered;
      delete order[orderIndex].priceOffered;
      return utilities.successStatus(res, 200, 'data', order[orderIndex]);
    }
    return utilities.errorstatus(res, 400, 'User Not Found');
  }
}

export default adsController;
