/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test for Login API', () => {
  describe('/POST Signin user', () => {
    it('should return a status 200 if all username and password is correct', (done) => {
      const body = {
        email: 'petertunde@gmail.com',
        password: 'password',
      };
      chai.request(server)
        .post('/api/v1/signin')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.a('object');
          expect(res.body).to.have.all.keys('status', 'data');
          expect(res.body.data).to.include.all.keys('id', 'token', 'firstName', 'lastName', 'email');
          expect(res.body.data.id).to.be.a('Number');
          expect(res.body.data.firstName).to.be.a('String');
          expect(res.body.data.lastName).to.be.a('String');
          expect(res.body.data.email).to.be.a('String');
          expect(res.body.data.token).to.be.a('String');
          done();
        });
    });
  });
  describe('/POST Signin user', () => {
    it('should return a status 400 if email field is absent', (done) => {
      const body = {
        password: 'password',
      };
      chai.request(server)
        .post('/api/v1/signin')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.a('object');
          expect(res.body).to.have.all.keys('status', 'error');
          expect(res.body.error).to.be.a('String');
          done();
        });
    });
  });
  describe('/POST Signin user', () => {
    it('should return a status 400 if password field is absent', (done) => {
      const body = {
        email: 'testAdmin@gmail.com',
      };
      chai.request(server)
        .post('/api/v1/signin')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.a('object');
          expect(res.body).to.have.all.keys('status', 'error');
          expect(res.body.error).to.be.a('String');
          done();
        });
    });
  });
  describe('/POST Signin user', () => {
    it('should return a status 403 if user is not in the database', (done) => {
      const body = {
        email: 'testAdmin@com',
        password: 'password',
      };
      chai.request(server)
        .post('/api/v1/signin')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res).to.be.a('object');
          expect(res.body).to.have.all.keys('status', 'error');
          expect(res.body.error).to.be.a('String');
          done();
        });
    });
  });
  describe('/POST Signin user', () => {
    it('should return a status 403 if user inputs wrong password', (done) => {
      const body = {
        email: 'petertunde@gmail.com',
        password: 'password1',
      };
      chai.request(server)
        .post('/api/v1/signin')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res).to.be.a('object');
          expect(res.body).to.have.all.keys('status', 'error');
          expect(res.body.error).to.be.a('String');
          done();
        });
    });
  });
});
