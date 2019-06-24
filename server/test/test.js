import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import user from './data/user';
import car from './data/car';
import order from './data/order';
import flag from './data/flag';

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
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
          done();
        });
    });
    it('should return an error with incomplete input field', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body).to.have.property('error').with.lengthOf(1);
          done();
        });
    });
    it('should return an error with existing email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('User Already Exist');
          done();
        });
    });
    it('should return error for invalid field', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({ firstName: '' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error').with.lengthOf(6);
          done();
        });
    });
  });
  it('should return error on invalid route', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signfgfgup')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
          done();
        });
    });
    it('should return an error with incorrect input details', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(user[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
    it('should return error for invalid field', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({ email: '' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
          expect(res.body.data.firstName).to.equal('admin');
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
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
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
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('data');
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
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not post  cars with unauthorise token', (done) => {
      chai.request(app)
        .post('/api/v1/car')
        .set('authtoken', adminToken)
        .send(car[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
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
          expect(res.body).to.have.property('error');
          done();
        });
    });
    it('should not create a purchase order with unauthorise id', (done) => {
      chai.request(app)
        .post('/api/v1/order/1')
        .set('authtoken', adminToken)
        .send(order[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
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
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
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
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not update the order price with unauthorized user token', (done) => {
      chai.request(app)
        .patch('/api/v1/order/3/price')
        .set('authtoken', adminToken)
        .send(order[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not mark car that does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/car/12/status')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should mark a car as sold', (done) => {
      chai.request(app)
        .patch('/api/v1/car/3/status')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          done();
        });
    });

    it('should not mark a car as sold with unauthorize token', (done) => {
      chai.request(app)
        .patch('/api/v1/car/2/status')
        .set('authtoken', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Update Car Price', () => {
    it('should not update the car price on invalid input', (done) => {
      chai.request(app)
        .patch('/api/v1/car/1/price')
        .set('authtoken', userToken)
        .send(car[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not update a car price that does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/car/12/price')
        .set('authtoken', userToken)
        .send(car[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not update a car price with negative input', (done) => {
      chai.request(app)
        .patch('/api/v1/car/12/price')
        .set('authtoken', userToken)
        .send(car[5])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
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
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          done();
        });
    });
    it('should not update a car price that has been sold', (done) => {
      chai.request(app)
        .patch('/api/v1/car/3/price')
        .set('authtoken', userToken)
        .send(car[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
    it('should update a car price', (done) => {
      chai.request(app)
        .patch('/api/v1/car/4/price')
        .set('authtoken', userToken)
        .send(car[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });

    it('should not update a car price with invalid owner', (done) => {
      chai.request(app)
        .patch('/api/v1/car/1/price')
        .set('authtoken', userToken)
        .send(car[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not update a car price with unauthorize token', (done) => {
      chai.request(app)
        .patch('/api/v1/car/3/price')
        .set('authtoken', adminToken)
        .send(car[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('View a Specific Car', () => {
    it('should not view a car that does not exist', (done) => {
      chai.request(app)
        .get('/api/v1/car/5/')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should view a specific car', (done) => {
      chai.request(app)
        .get('/api/v1/car/3/')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          done();
        });
    });


    it('should not view a specific car with unauthorise token', (done) => {
      chai.request(app)
        .get('/api/v1/car/2/')
        .set('authtoken', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('View All Unsold Car', () => {
    it('should view all unsold car', (done) => {
      chai.request(app)
        .get('/api/v1/car?status=available')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });

    it('should not view all unsold car with invalid input', (done) => {
      chai.request(app)
        .get('/api/v1/car?status=avail')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('View All Unsold Cars Within A Price Range', () => {
    it('should view all unsold cars within a price range', (done) => {
      chai.request(app)
        .get('/api/v1/car?status=available&min_price=50000&max_price=90000000000')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });

    it('should not view all unsold car if it does not meet the price range', (done) => {
      chai.request(app)
        .get('/api/v1/car?status=available&min_price=500000000000&max_price=90000000000')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Delete Car Ad', () => {
    it('should sign in admin', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(user[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          adminToken = res.body.data.token;
          done();
        });
    });

    it('should delete a car ad', (done) => {
      chai.request(app)
        .delete('/api/v1/car/2')
        .set('authtoken', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });

    it('should not delete a car ad that does not exist', (done) => {
      chai.request(app)
        .delete('/api/v1/car/7')
        .set('authtoken', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should return an error with invild input details', (done) => {
      chai.request(app)
        .delete('/api/v1/car/hvhjv')
        .set('authtoken', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not delete a car ad with unathorise user', (done) => {
      chai.request(app)
        .delete('/api/v1/car/2')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('View All Cars', () => {
    it('should view all car that exist', (done) => {
      chai.request(app)
        .get('/api/v1/car')
        .set('authtoken', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });

  describe('View All Cars By Body Type', () => {
    it('should view all car that exist', (done) => {
      chai.request(app)
        .get('/api/v1/car?body_type=car')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should not view all car that does not exist with a particular body type', (done) => {
      chai.request(app)
        .get('/api/v1/car?body_type=van')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Flag Report', () => {
    it('should flag a car as fradulent', (done) => {
      chai.request(app)
        .post('/api/v1/flag/3')
        .set('authtoken', userToken)
        .send(flag[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          done();
        });
    });

    it('should flag a car as fradulent', (done) => {
      chai.request(app)
        .post('/api/v1/flag/39')
        .set('authtoken', userToken)
        .send(flag[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });
    it('should not flag a car with invalid input details', (done) => {
      chai.request(app)
        .post('/api/v1/flag/2')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not flag a car with unauthorise access', (done) => {
      chai.request(app)
        .post('/api/v1/flag/3')
        .set('authtoken', adminToken)
        .send(flag[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('error');
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
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});
