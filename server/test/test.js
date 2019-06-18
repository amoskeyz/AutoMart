import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import user from './data/user';
import car from './data/car';

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
