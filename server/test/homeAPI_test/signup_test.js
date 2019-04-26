/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server, { store } from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test for signup API', () => {
  after((done) => {
    store.userStore.remove({ email: 'testAdmin@email.com' }, (err, result) => {
      done();
    });
  });
  it('should return a status 200 if all important fields are entered', (done) => {
    const body = {
      firstName: 'Onu',
      lastName: 'Wednesday',
      email: 'testAdmin@email.com',
      password: 'password',
      confirmPassword: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
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
  it('should return a status 400 if firstName or lastname is not a number', (done) => {
    const body = {
      firstName: '7pe',
      lastName: 'Wednes123',
      email: 'testAdmin@email.com',
      password: 'password',
      confirmPassword: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
  it('should return a status 400 if firstName field is absent', (done) => {
    const body = {
      lastName: 'Monday',
      email: 'testAdmin@email.com',
      password: 'password',
      confirmPassword: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
  it('should return a status 400 if lastName field is absent', (done) => {
    const body = {
      firstName: 'Monday',
      email: 'testAdmin@email.com',
      password: 'password',
      confirmPassword: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
  it('should return a status 400 if email field is absent', (done) => {
    const body = {
      firstName: 'Monday',
      lastName: 'Onu',
      password: 'password',
      confirmPassword: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
  it('should return a status 400 if password field is absent', (done) => {
    const body = {
      firstName: 'Monday',
      lastName: 'Onu',
      email: 'testAdmin@email.com',
      confirmPassword: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
  it('should return a status 400 if confirmPassword field is absent', (done) => {
    const body = {
      firstName: 'Monday',
      lastName: 'Onu',
      email: 'testAdmin@email.com',
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
  it('should return a status 400 if email is invalid', (done) => {
    const body = {
      firstName: 'Monday',
      lastName: 'Onu',
      email: 'email--@com',
      password: 'password',
      confirmPassword: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
  it('should return a status 400 if password and confirmPassword does not match', (done) => {
    const body = {
      firstName: 'Monday',
      lastName: 'Onu',
      email: 'goodEmail@something.com',
      password: 'password',
      confirmPassword: 'password2',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
  it('should return a status 400 if email is not unique', (done) => {
    const body = {
      firstName: 'Peter',
      lastName: 'Tunde',
      email: 'peter123tunde@email.com',
      password: 'password',
      confirmPassword: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
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
