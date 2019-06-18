import utilities from '../helper/utilities';
import dbMethods from '../db/migrations/dbMethods';


class adsController {
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
}


export default adsController;
