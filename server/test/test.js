import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import user from './data/user';
import car from './data/car';

let userToken;

const { expect } = chai;
chai.use(chaihttp);

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
          userToken = res.body.data.Token;
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
    it('should not post a car ad without user token', (done) => {
      chai.request(app)
        .post('/api/v1/cars/')
        .send(car[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('should post a car ad for an existing user', (done) => {
      chai.request(app)
        .post('/api/v1/cars/')
        .set('authtoken', userToken)
        .send(car[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should not post an ad with invalid car details', (done) => {
      chai.request(app)
        .post('/api/v1/cars/')
        .set('authtoken', userToken)
        .send(car[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('Authentication', () => {
    it('should not post with invalid id', (done) => {
      chai.request(app)
        .post('/api/v1/cars/')
        .set('authtoken', 'jhosjfhaojfhoa')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('should not post an ad with unauthorized id', (done) => {
      chai.request(app)
        .post('/api/v1/cars/')
        .set('authtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTU1ODg5NTE5MywiZXhwIjo4NjQwMDAwMDAwMDE1NTkwMDAwMDB9.o-vzr3gzF_49d1QIvslkcpsWO9qbqqK8ZeG5-LzeTHc')
        .send(car[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });
});
