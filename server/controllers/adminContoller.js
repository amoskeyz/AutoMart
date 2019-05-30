import utilities from '../helper/utilities';
import cars from '../model/cars';

class Admin {
  static deleteCar(req, res) {
    const { user } = req;
    if (user[0].isAdmin === true) {
      const { carId } = req.params;
      const carFilt = cars.filter(car => car.id === Number(carId));
      if (!carFilt[0]) return utilities.errorstatus(res, 404, 'Car Not Found');
      const carIndex = cars.findIndex(car => car.id === Number(carId));
      cars.splice(carIndex, 1);
      return utilities.successStatus(res, 200, 'data', 'Car Ad Successfully Deleted');
    }
    return utilities.errorstatus(res, 401, 'Unauthorise User');
  }
}

export default Admin;
