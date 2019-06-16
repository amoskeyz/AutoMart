import bcrypt from 'bcrypt';

class Encrypt {
  static passwordhash(password) {
    return bcrypt.hashSync(password, 10);
  }
}

export default Encrypt;
