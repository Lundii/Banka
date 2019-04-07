/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Create Bank Account', () => {
  describe('/POST create account number', () => {
    it('should return a status 200 if all important fields are entered', (done) => {
      const body = {
        firstName: 'Onu',
        lastName: 'Monday',
        email: 'mondayemmauel67@gmail.com',
        sex: 'male',
        phoneNumber: '090890987909',
        dateOfBirth: new Date().getDate,
        type: 'saving',
      };
      chai.request(server)
        .post('/create')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.a('object');
          expect(res.body).to.have.all.keys('status', 'data');
          expect(res.body.data).to.have.all.keys('accountNumber', 'firstName', 'lastName', 'email', 'type');
          expect(res.body.data.accountNumber).to.be.a('Number');
          expect(res.body.data.firstName).to.be.a('String');
          expect(res.body.data.lastName).to.be.a('String');
          expect(res.body.data.email).to.be.a('String');
          expect(res.body.data.type).to.be.a('String');
          done();
        });
    });
  });
  describe('/POST create account number', () => {
    it('should return a status 400 if an important field is omited', (done) => {
      const body = {
        firstName: '',
        lastName: 'Monday',
        email: 'mondayemmauel67@gmail.com',
        sex: 'male',
        phoneNumber: '090890987909',
        dateOfBirth: new Date().getDate,
      };
      chai.request(server)
        .post('/create')
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
});
