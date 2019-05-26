import utilities from '../helper/utilities';
import cars from '../model/cars';
import users from '../model/user';

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
}

export default adsController;
