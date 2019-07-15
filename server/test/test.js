import chai from 'chai';
import chaihttp from 'chai-http';
import sinon from 'sinon';
import app from '../app';
import user from './data/user';
import car from './data/car';
import order from './data/order';
import flag from './data/flag';
import { obj } from '../controllers/uploadController';

const { expect } = chai;
chai.use(chaihttp);

let userToken;
let adminToken;
let upload;

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
          expect(res.body).to.have.property('error').with.lengthOf(5);
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

    it('should return user details', (done) => {
      chai.request(app)
        .post('/api/v1/user')
        .send(user[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });

    it('should return error with invalid details', (done) => {
      chai.request(app)
        .post('/api/v1/user')
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
          // console.log(res.body);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
          expect(res.body.data.first_name).to.equal('admin');
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
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
        .send(car[4])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not post  cars with unauthorised token', (done) => {
      chai.request(app)
        .post('/api/v1/car')
        .set('token', adminToken)
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
        .post('/api/v1/order')
        .set('token', userToken)
        .send(order[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should create a purchase order', (done) => {
      chai.request(app)
        .post('/api/v1/order')
        .set('token', userToken)
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
        .post('/api/v1/order')
        .set('token', userToken)
        .send(order[4])
        .end((err, res) => {
          console.log(res.body);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
    it('should not create a purchase order with unauthorised id', (done) => {
      chai.request(app)
        .post('/api/v1/order')
        .set('token', adminToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
        .send(order[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not update the order price with unorized user token', (done) => {
      chai.request(app)
        .patch('/api/v1/order/3/price')
        .set('token', adminToken)
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
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not mark car that does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/car/12/status')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should mark a car as sold', (done) => {
      chai.request(app)
        .patch('/api/v1/car/3/status')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          done();
        });
    });

    it('should not mark a car as sold with unorize token', (done) => {
      chai.request(app)
        .patch('/api/v1/car/2/status')
        .set('token', adminToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
        .send(car[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          done();
        });
    });
    it('should update a car price', (done) => {
      chai.request(app)
        .patch('/api/v1/car/4/price')
        .set('token', userToken)
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
        .set('token', userToken)
        .send(car[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not update a car price with unorize token', (done) => {
      chai.request(app)
        .patch('/api/v1/car/3/price')
        .set('token', adminToken)
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
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should view a specific car', (done) => {
      chai.request(app)
        .get('/api/v1/car/3/')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          done();
        });
    });


    it('should not view a specific car with unauthorised token', (done) => {
      chai.request(app)
        .get('/api/v1/car/2/')
        .set('token', adminToken)
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
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });

    it('should not view all unsold car with invalid input', (done) => {
      chai.request(app)
        .get('/api/v1/car?status=avail')
        .set('token', userToken)
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
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });

    it('should not view all unsold car if it does not meet the price range', (done) => {
      chai.request(app)
        .get('/api/v1/car?status=available&min_price=500000000000&max_price=90000000000')
        .set('token', userToken)
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
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });

    it('should not delete a car ad that does not exist', (done) => {
      chai.request(app)
        .delete('/api/v1/car/7')
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should return an error with invild input details', (done) => {
      chai.request(app)
        .delete('/api/v1/car/hvhjv')
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not delete a car ad with unathorise user', (done) => {
      chai.request(app)
        .delete('/api/v1/car/2')
        .set('token', userToken)
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
        .set('token', adminToken)
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
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should not view all car that does not exist with a particular body type', (done) => {
      chai.request(app)
        .get('/api/v1/car?body_type=van')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  // describe('Upload', () => {
  //   let upload;
  //   beforeEach(() => {
  //     upload = sinon.stub(uploadController, 'upload').returns(() => {});
  //     // upload.yields('result');
  //   });
  //   afterEach(() => {
  //     upload.restore();
  //   });
  //   it('should not view all car that does not exist with a particular body type', (done) => {
  //     upload.yields('result');
  //     console.log(upload);
  //     // uploadImage.yields("link to image");
  //     chai.request(app)
  //     // uploadImage.yields('link to image');
  //       .post('/api/v1/upload')
  //       .set('token', userToken)
  //       .field('Content-Type', 'multipart/form-data')
  //       .attach('photo', './server/test/test.jpg', 'test.jpg')
  //       .end((err, res) => {
  //         console.log(res.body);
  //         // expect(res.statusCode).to.equal(200);
  //         expect(res.body).to.equal('result');
  //         done();
  //       });
  //   });
  // });

  describe('Upload', () => {
    beforeEach(async () => {
    });
    afterEach(() => {
      upload.restore();
    });
    it('should not view all car that does not exist with a particular body type', async () => {
      upload = sinon.stub(obj, 'getImage').resolves({ url: 'result' });
      const res = await chai.request(app)
        .post('/api/v1/upload')
        .set('token', userToken)
        .field('Content-Type', 'multipart/form-data')
        .attach('photo', './server/test/test.jpg', 'test.jpg');
      console.log(res.body);
      expect(res.statusCode).to.equal(200);
      expect(res.body.data).to.equal('result');
    });

    it('should flag a car as fradulent', (done) => {
      chai.request(app)
        .post('/api/v1/upload')
        .set('token', userToken)
        .send({ car_image: '' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('UploadCarImage', () => {
    it('should', (done) => {
      chai.request(app)
        .patch('/api/v1/cars/2')
        .set('token', userToken)
        .send({ car_image: '' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });

  describe('Flag Report', () => {
    it('should flag a car as fradulent', (done) => {
      chai.request(app)
        .post('/api/v1/flag/3')
        .set('token', userToken)
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
        .set('token', userToken)
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
        .set('token', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not flag a car with unauthorised access', (done) => {
      chai.request(app)
        .post('/api/v1/flag/3')
        .set('token', adminToken)
        .send(flag[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('entication', () => {
    it('should not post a car ads with unorized id', (done) => {
      chai.request(app)
        .post('/api/v1/car')
        .set('token', 'jhosjfhaojfhoa')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});
