import utilities from '../helper/utilities';
import dbMethods from '../db/migrations/dbMethods';


class carController {
  static async postAds(req, res) {
    const { isAdmin, email } = req.user;
    if (!isAdmin) {
      const {
        manufacturer, model, bodyType, price, state,
      } = req.body;
      const status = 'available';
      const carCreated = await dbMethods.insertToDb('cars', {
        email, manufacturer, model, bodytype: bodyType, price, state, status,
      }, 'RETURNING *');
      return utilities.successStatus(res, 201, 'data', carCreated);
    }
    return utilities.errorstatus(res, 401, 'Unauthorise Access');
  }

  static async markSold(req, res) {
    try {
      const { isAdmin, email } = req.user;
      const { carId } = req.params;
      if (!isAdmin) {
        const carCheck = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });
        if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');
        if (email === carCheck[0].email) {
          await dbMethods.updateDbRow('cars', { status: 'sold' }, { id: Number(carId) });
          const carDetails = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });
          return utilities.successStatus(res, 200, 'data', carDetails[0]);
        } return utilities.errorstatus(res, 400, 'User Can Not Mark This Car As Sold');
      } return utilities.errorstatus(res, 401, 'Unauthorise Access');
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async updateCar(req, res) {
    try {
      const { isAdmin, email } = req.user;
      const { carId } = req.params;
      const updatePrice = req.body.price;
      if (!isAdmin) {
        const carCheck = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });
        if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');
        if (carCheck[0].status === 'sold') return utilities.errorstatus(res, 400, 'Car Already Sold');
        if (email === carCheck[0].email) {
          await dbMethods.updateDbRow('cars', { price: updatePrice }, { id: Number(carId) });
          const carDetails = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });
          return utilities.successStatus(res, 200, 'data', carDetails);
        } return utilities.errorstatus(res, 400, ' User Can Not Update This Car Price');
      } return utilities.errorstatus(res, 401, 'Unauthorise Access');
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async specificCar(req, res) {
    try {
      const { isAdmin } = req.user;
      const { carId } = req.params;
      if (!isAdmin) {
        const carCheck = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });
        if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');
        return utilities.successStatus(res, 200, 'data', carCheck[0]);
      } return utilities.errorstatus(res, 401, 'Unauthorise Access');
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async car(req, res) {
    const { status } = req.query;
    if (status) {
      if (req.query.min_price && req.query.max_price) {
        const unsoldCars = await dbMethods.readFromDb('cars', '*', { status });
        const minPrice = Math.round(Number(req.query.min_price));
        const maxPrice = Math.round(Number(req.query.max_price));
        const carPrice = unsoldCars.filter(car => car.price >= minPrice && car.price <= maxPrice);
        if (!carPrice[0]) return utilities.errorstatus(res, 404, 'No Car Found Within This Price Range');
        return utilities.successStatus(res, 200, 'data', carPrice);
      }
      const unsoldCars = await dbMethods.readFromDb('cars', '*', { status });
      return utilities.successStatus(res, 200, 'data', unsoldCars);
    }
    return utilities.errorstatus(res, 400, 'Invalid Query String');
  }
}


export default carController;
