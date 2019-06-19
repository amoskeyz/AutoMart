import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import user from './data/user';
import car from './data/car';
import order from './data/order';

const { expect } = chai;
chai.use(chaihttp);

let userToken;
let adminToken;

describe('AutoMart Test', () => {
  describe('/Display welcome message', () => {
    it('display the welcome messqge', (done) => {
      chai.request(app)
        .get('/api/v1/')
        .end((err, res) => {
          expect(res.body.message).to.equal('Welcome to AutoMart');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('SIGN UP', () => {
    it('should sign up a new user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });
    it('should return an error with incomplete input field', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
    it('should return an error with existing email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
    it('should return error for invalid field', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({ firstName: '' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });
  it('should return error on invalid route', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signfgfgup')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
  });

  describe('LOGIN', () => {
    it('should sign in an existing user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(user[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
    it('should return an error with incorrect input details', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(user[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
    it('should return error for invalid field', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({ email: '' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('Post Car Ad', () => {
    it('should sign in admin', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(user[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          adminToken = res.body.data.token;
          done();
        });
    });
    it('should sign in an existing user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(user[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          userToken = res.body.data.token;
          done();
        });
    });
    it('should not post a car ad without user token', (done) => {
      chai.request(app)
        .post('/api/v1/car/')
        .send(car[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('should post a car ad for an existing user', (done) => {
      chai.request(app)
        .post('/api/v1/car/')
        .set('authtoken', userToken)
        .send(car[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should not post an ad with negative car price', (done) => {
      chai.request(app)
        .post('/api/v1/car/')
        .set('authtoken', userToken)
        .send(car[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not post an ad with invalid car details', (done) => {
      chai.request(app)
        .post('/api/v1/car/')
        .set('authtoken', userToken)
        .send(car[4])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not view cars with unauthorise token', (done) => {
      chai.request(app)
        .post('/api/v1/car')
        .set('authtoken', adminToken)
        .send(car[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
  });

  describe('Purchase Order', () => {
    it('should not make a purchase order with invalid input data', (done) => {
      chai.request(app)
        .post('/api/v1/order/1')
        .set('authtoken', userToken)
        .send(order[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should create a purchase order', (done) => {
      chai.request(app)
        .post('/api/v1/order/1')
        .set('authtoken', userToken)
        .send(order[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should not make a purchase order with negative price', (done) => {
      chai.request(app)
        .post('/api/v1/order/1')
        .set('authtoken', userToken)
        .send(order[4])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
    it('should not create ba purchase order with unauthorise id', (done) => {
      chai.request(app)
        .post('/api/v1/order/1')
        .set('authtoken', adminToken)
        .send(order[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });


    it('should not make a purchase order if car does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/order/6')
        .set('authtoken', userToken)
        .send(order[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe('Update Purchase Order', () => {
    it('should not update the price of an order if buyerId !== userId', (done) => {
      chai.request(app)
        .patch('/api/v1/order/1/price')
        .set('authtoken', userToken)
        .send(order[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not update the price of a purchase order is status is approved', (done) => {
      chai.request(app)
        .patch('/api/v1/order/2/price')
        .set('authtoken', userToken)
        .send(order[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not update the price of a purchase order with negative price', (done) => {
      chai.request(app)
        .patch('/api/v1/order/2/price')
        .set('authtoken', userToken)
        .send(order[5])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should update the price of a purchase order', (done) => {
      chai.request(app)
        .patch('/api/v1/order/3/price')
        .set('authtoken', userToken)
        .send(order[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });


    it('should update the price of a purchase order', (done) => {
      chai.request(app)
        .patch('/api/v1/order/3/price')
        .set('authtoken', userToken)
        .send(order[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should return error if order is not found', (done) => {
      chai.request(app)
        .patch('/api/v1/order/9/price')
        .set('authtoken', userToken)
        .send(order[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not update the order price with wrong input details', (done) => {
      chai.request(app)
        .patch('/api/v1/order/3/price')
        .set('authtoken', userToken)
        .send(order[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not update the order price with unauthorized user token', (done) => {
      chai.request(app)
        .patch('/api/v1/order/3/price')
        .set('authtoken', adminToken)
        .send(order[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
  });

  describe('Mark Car as Sold', () => {
    it('should not mark car as sold if not owner of car', (done) => {
      chai.request(app)
        .patch('/api/v1/car/1/status')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not mark car that does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/car/12/status')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should mark a car as sold', (done) => {
      chai.request(app)
        .patch('/api/v1/car/3/status')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should not mark a car as sold with unauthorize token', (done) => {
      chai.request(app)
        .patch('/api/v1/car/2/status')
        .set('authtoken', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
  });

  describe('Authentication', () => {
    it('should not post a car ads with unauthorized id', (done) => {
      chai.request(app)
        .post('/api/v1/car')
        .set('authtoken', 'jhosjfhaojfhoa')
        .end((err, res) => {
          expect(res.statusCode).to.equal(500);
          done();
        });
    });
  });
});
