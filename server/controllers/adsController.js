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
      const status = 'available';
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
      if (isOrder[0].status === 'Pending') {
        if (isOrder[0].buyerId !== userId) return utilities.errorstatus(res, 400, 'Unauthorized user');
        const orderIndex = order.findIndex(ord => ord.id === Number(orderId));
        if (order[orderIndex].priceOffered) {
          order[orderIndex].oldPriceOffered = order[orderIndex].priceOffered;
        } else order[orderIndex].oldPriceOffered = order[orderIndex].newPriceOffered;
        order[orderIndex].newPriceOffered = newPriceOffered;
        delete order[orderIndex].priceOffered;
        return utilities.successStatus(res, 200, 'data', order[orderIndex]);
      } return utilities.errorstatus(res, 400, 'Purchase Order Already Approved');
    }
    return utilities.errorstatus(res, 400, 'User Not Found');
  }

  static markSold(req, res) {
    const userId = req.decoder;
    const { carId } = req.params;
    const user = users.filter(use => use.id === Number(userId));
    if (user[0]) {
      const carCheck = cars.filter(check => check.id === Number(carId));
      if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');
      if (user[0].email === carCheck[0].email) {
        const carIndex = cars.findIndex(car => car.id === Number(carId));
        cars[carIndex].status = 'sold';
        return utilities.successStatus(res, 200, 'data', cars[carIndex]);
      } return utilities.errorstatus(res, 400, 'Unauthorize User');
    } return utilities.errorstatus(res, 400, 'Invalid User');
  }

  static updateCar(req, res) {
    const userId = req.decoder;
    const { carId } = req.params;
    const updatePrice = req.body.price;
    const user = users.filter(use => use.id === Number(userId));
    if (user[0]) {
      const carCheck = cars.filter(check => check.id === Number(carId));
      if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');
      if (user[0].email === carCheck[0].email) {
        const carIndex = cars.findIndex(car => car.id === Number(carId));
        cars[carIndex].price = updatePrice;
        return utilities.successStatus(res, 200, 'data', cars[carIndex]);
      } return utilities.errorstatus(res, 400, 'Unauthorize User');
    } return utilities.errorstatus(res, 400, 'Invalid User');
  }

  static specificCar(req, res) {
    const userId = req.decoder;
    const { carId } = req.params;
    const user = users.filter(use => use.id === Number(userId));
    if (user[0]) {
      const carCheck = cars.filter(check => check.id === Number(carId));
      if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');
      const carIndex = cars.findIndex(car => car.id === Number(carId));
      return utilities.successStatus(res, 200, 'data', cars[carIndex]);
    } return utilities.errorstatus(res, 400, 'Invalid User');
  }

  static car(req, res) {
    const { status } = req.query;
    const { user } = req;
    if (user[0]) {
      if (status) {
        if (req.query.min_price && req.query.max_price) {
          const minPrice = Math.round(Number(req.query.min_price));
          const maxPrice = Math.round(Number(req.query.max_price));
          const carPrice = cars.filter(car => car.price >= minPrice && car.price <= maxPrice);
          if (!carPrice[0]) return utilities.errorstatus(res, 404, 'No Car Found Within This Price Range');
          return utilities.successStatus(res, 200, 'data', carPrice);
        }
        const unsoldCars = cars.filter(car => car.status === status);
        return utilities.successStatus(res, 200, 'data', unsoldCars);
      } return utilities.successStatus(res, 200, 'data', cars);
    } return utilities.errorstatus(res, 400, 'Invalid User, Please Sign-up');
  }
}


export default adsController;
