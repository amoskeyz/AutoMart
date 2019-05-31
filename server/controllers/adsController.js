import utilities from '../helper/utilities';
import cars from '../model/cars';
import order from '../model/order';
import flags from '../model/flags';

class adsController {
  static postAds(req, res) {
    const { isAdmin, email } = req.user;
    if (!isAdmin) {
      const {
        manufacturer, model, bodyType, price, state,
      } = req.body;
      const id = cars.length + 1;
      const status = 'available';
      const createdOn = new Date();
      const carObj = {
        id, email, createdOn, manufacturer, model, bodyType, price, state, status,
      };
      cars.push(carObj);
      return utilities.successStatus(res, 201, 'data', carObj);
    }
    return utilities.errorstatus(res, 401, 'Unauthorise Access');
  }

  static purchaseOrder(req, res) {
    const userId = req.user.id;
    const { isAdmin } = req.user;
    const carId = Number(req.params.id);
    const isCar = cars.filter(car => car.id === carId);
    if (!isCar[0]) return utilities.errorstatus(res, 404, 'Car Not Found');
    if (!isAdmin) {
      const { priceOffered } = req.body;
      const id = order.length + 1;
      const createdOn = new Date();
      const status = 'pending';
      const buyerId = userId;
      const { price } = isCar[0];
      const orderObj = {
        id, buyerId, carId, createdOn, status, price, priceOffered,
      };
      order.push(orderObj);
      return utilities.successStatus(res, 201, 'data', orderObj);
    }
    return utilities.errorstatus(res, 401, 'Unauthorise Access');
  }

  static updatePurchase(req, res) {
    const { id, isAdmin } = req.user;
    const { newPriceOffered } = req.body;
    const { orderId } = req.params;
    if (!isAdmin) {
      const isOrder = order.filter(orde => orde.id === Number(orderId));
      if (!isOrder[0]) return utilities.errorstatus(res, 400, 'Purchase Order Not found');
      if (isOrder[0].status === 'pending') {
        if (isOrder[0].buyerId !== id) return utilities.errorstatus(res, 400, 'Unauthorized user');
        const orderIndex = order.findIndex(ord => ord.id === Number(orderId));
        if (order[orderIndex].priceOffered) {
          order[orderIndex].oldPriceOffered = order[orderIndex].priceOffered;
        } else order[orderIndex].oldPriceOffered = order[orderIndex].newPriceOffered;
        order[orderIndex].newPriceOffered = newPriceOffered;
        delete order[orderIndex].priceOffered;
        return utilities.successStatus(res, 200, 'data', order[orderIndex]);
      } return utilities.errorstatus(res, 400, 'Purchase Order Already Approved');
    }
    return utilities.errorstatus(res, 401, 'Unauthorise Access');
  }

  static markSold(req, res) {
    const { isAdmin, email } = req.user;
    const { carId } = req.params;
    if (!isAdmin) {
      const carCheck = cars.filter(check => check.id === Number(carId));
      if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');
      if (email === carCheck[0].email) {
        const carIndex = cars.findIndex(car => car.id === Number(carId));
        cars[carIndex].status = 'sold';
        return utilities.successStatus(res, 200, 'data', cars[carIndex]);
      } return utilities.errorstatus(res, 400, 'User Can Not Mark This Car As Sold');
    } return utilities.errorstatus(res, 401, 'Unauthorise Access');
  }

  static updateCar(req, res) {
    const { isAdmin, email } = req.user;
    const { carId } = req.params;
    const updatePrice = req.body.price;
    if (!isAdmin) {
      const carCheck = cars.filter(check => check.id === Number(carId));
      if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');
      if (email === carCheck[0].email) {
        const carIndex = cars.findIndex(car => car.id === Number(carId));
        cars[carIndex].price = updatePrice;
        return utilities.successStatus(res, 200, 'data', cars[carIndex]);
      } return utilities.errorstatus(res, 400, ' User Can Not Update This Car Price');
    } return utilities.errorstatus(res, 401, 'Unauthorise Access');
  }

  static specificCar(req, res) {
    const { isAdmin } = req.user;
    const { carId } = req.params;
    if (!isAdmin) {
      const carCheck = cars.filter(check => check.id === Number(carId));
      if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');
      const carIndex = cars.findIndex(car => car.id === Number(carId));
      return utilities.successStatus(res, 200, 'data', cars[carIndex]);
    } return utilities.errorstatus(res, 401, 'Unauthorise Access');
  }

  static car(req, res) {
    const { status } = req.query;
    if (status) {
      if (req.query.min_price && req.query.max_price) {
        const unsoldCars = cars.filter(car => car.status === status);
        const minPrice = Math.round(Number(req.query.min_price));
        const maxPrice = Math.round(Number(req.query.max_price));
        const carPrice = unsoldCars.filter(car => car.price >= minPrice && car.price <= maxPrice);
        if (!carPrice[0]) return utilities.errorstatus(res, 404, 'No Car Found Within This Price Range');
        return utilities.successStatus(res, 200, 'data', carPrice);
      }
      const unsoldCars = cars.filter(car => car.status === status);
      return utilities.successStatus(res, 200, 'data', unsoldCars);
    } return utilities.successStatus(res, 200, 'data', cars);
  }

  static flagCar(req, res) {
    const { isAdmin } = req.user;
    const { reason, description } = req.body;
    const { carId } = req.params;
    if (!isAdmin) {
      const id = flags.length + 1;
      const createdOn = new Date();
      const flagObj = {
        id, carId, createdOn, reason, description,
      };
      return utilities.successStatus(res, 201, 'data', flagObj);
    } return utilities.errorstatus(res, 401, 'Unauthorise Access');
  }
}


export default adsController;
