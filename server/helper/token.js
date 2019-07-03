import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const token = payload => jwt.sign(payload, process.env.secretKey, {
  expiresIn: '1d',
});

export default token;
