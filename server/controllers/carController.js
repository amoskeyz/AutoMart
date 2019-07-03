import utilities from '../helper/utilities';
import dbMethods from '../db/migrations/dbMethods';
import pool from '../db/config/config';


class carController {
  static async postAds(req, res) {
    try {
      const { email } = req.user;

      const {
        manufacturer, model, bodyType, price, state,
      } = req.body;

      const status = 'available';

      const carCreated = await dbMethods.insertToDb('cars', {
        email, manufacturer, model, bodytype: bodyType, price, state, status,
      }, 'RETURNING *');

      return utilities.successStatus(res, 201, 'data', carCreated);
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async markSold(req, res) {
    try {
      const { email } = req.user;
      const { carId } = req.params;

      const carCheck = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });

      if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');

      if (email === carCheck[0].email) {
        await dbMethods.updateDbRow('cars', { status: 'sold' }, { id: Number(carId) });

        const carDetails = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });

        return utilities.successStatus(res, 200, 'data', carDetails[0]);
      } return utilities.errorstatus(res, 400, 'User Can Not Mark This Car As Sold');
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async updateCar(req, res) {
    try {
      const { email } = req.user;
      const { carId } = req.params;
      const updatePrice = req.body.price;

      const carCheck = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });

      if (!carCheck[0]) return utilities.errorstatus(res, 400, 'Car Does Not Exist');

      if (email !== carCheck[0].email) return utilities.errorstatus(res, 400, 'You Are not allowed to perform this action');

      if (carCheck[0].status !== 'sold') {
        await dbMethods.updateDbRow('cars', { price: updatePrice }, { id: Number(carId) });

        const carDetails = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });

        return utilities.successStatus(res, 200, 'data', carDetails);
      } return utilities.errorstatus(res, 400, 'Car Already Sold');
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async specificCar(req, res) {
    try {
      const { carId } = req.params;

      const carCheck = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });

      if (!carCheck[0]) return utilities.errorstatus(res, 404, 'Car Not Found');

      return utilities.successStatus(res, 200, 'data', carCheck[0]);
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }

  static async car(req, res) {
    const { isAdmin } = req.user;
    const { status } = req.query;
    const bodyType = req.query.body_type;

    const cars = await pool.query('select * from cars');

    if (isAdmin && !status && !bodyType) {
      return utilities.successStatus(res, 200, 'data', cars.rows);
    }

    if (!isAdmin) {
      if (status) {
        if (req.query.min_price && req.query.max_price) {
          const unsoldCars = await dbMethods.readFromDb('cars', '*', { status: status.toLowerCase() });

          const minPrice = Math.round(Number(req.query.min_price));
          const maxPrice = Math.round(Number(req.query.max_price));

          const carPrice = unsoldCars.filter(car => car.price >= minPrice && car.price <= maxPrice);

          if (!carPrice[0]) return utilities.errorstatus(res, 404, 'No Car Found Within This Price Range');
          return utilities.successStatus(res, 200, 'data', carPrice);
        }

        const unsoldCars = await dbMethods.readFromDb('cars', '*', { status });
        return utilities.successStatus(res, 200, 'data', unsoldCars);
      }

      if (bodyType) {
        const carType = await dbMethods.readFromDb('cars', '*', { bodytype: bodyType.toLowerCase() });

        if (!carType[0]) return utilities.errorstatus(res, 404, 'No Car With This Body Type Found');
        return utilities.successStatus(res, 200, 'data', carType);
      }
    } return utilities.errorstatus(res, 403, 'Forbidden, You Are not allowed to perform this action');
  }

  static async flagCar(req, res) {
    const { reason, description } = req.body;
    const { carId } = req.params;

    const car = await dbMethods.readFromDb('cars', '*', { id: carId });

    if (!car[0]) return utilities.errorstatus(res, 404, 'Car Not Found');

    const flagObj = await dbMethods.insertToDb('flags', { carId, reason, description }, 'RETURNING *');

    return utilities.successStatus(res, 201, 'data', flagObj);
  }
}


export default carController;
