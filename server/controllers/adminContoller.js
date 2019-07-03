import utilities from '../helper/utilities';
import dbMethods from '../db/migrations/dbMethods';


class Admin {
  static async deleteCar(req, res) {
    try {
      const { carId } = req.params;

      const carFilt = await dbMethods.readFromDb('cars', '*', { id: Number(carId) });

      if (!carFilt[0]) return utilities.errorstatus(res, 404, 'Car Not Found');

      await dbMethods.deleteDbRow('cars', { id: Number(carId) });

      return utilities.successStatus(res, 200, 'data', 'Car Ad Successfully Deleted');
    } catch (error) {
      return utilities.errorstatus(res, 500, 'SERVER ERROR');
    }
  }
}

export default Admin;
