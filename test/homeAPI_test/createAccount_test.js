/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Create Bank Account', () => {
  describe('/POST create account number', () => {
    it('should return a status 200 if user is registered and have a vaid token', (done) => {
      const body = {
        firstName: 'Onu',
        lastName: 'Monday',
        email: 'differentmail@gmail.com',
        password: 'password',
        confirmPassword: 'password',
      };
      chai.request(server)
        .post('/api/v1/signup')
        .send(body)
        .end((err, res) => {
          expect(res.body.data).to.include.all.keys('token');
          expect(res.body.data.token).to.be.a('String');
          const { token } = res.body.data;
          const body2 = {
            firstName: res.body.data.firstName,
            lastName: res.body.data.lastName,
            email: res.body.data.email,
            type: 'savings',
          };
          chai.request(server)
            .post('/api/v1/user/accounts')
            .send(body2)
            .set('Authorization', token)
            .end((er, resp) => {
              console.log(resp.body);
              expect(resp).to.have.status(200);
              expect(resp).to.be.a('object');
              expect(resp.body).to.have.all.keys('status', 'data');
              expect(resp.body.data).to.include.all.keys('accountNumber', 'firstName', 'lastName', 'email', 'type', 'openingBalance');
              expect(resp.body.data.accountNumber).to.be.a('Number');
              expect(resp.body.data.firstName).to.be.a('String');
              expect(resp.body.data.lastName).to.be.a('String');
              expect(resp.body.data.email).to.be.a('String');
              expect(resp.body.data.type).to.be.a('String');
              expect(resp.body.data.openingBalance).to.be.a('Number');
              done();
            });
        });
    });
  });
  describe('/POST create account number', () => {
    it('should return a status 401 is user does not have a valid or expired token', (done) => {
      const body = {
        firstName: 'Onu',
        lastName: 'Monday',
        email: 'differentmail@gmail.com',
        type: 'savings',
      };
      chai.request(server)
        .post('/api/v1/user/accounts')
        .send(body)
        .set('Authorization', 'ghjklldiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJtb25kYXkiLCJlbWFpbCI6Im1vbmRheXR1ZXNkYXlAZ21haWwuY29tIiwiaWF0IjoxNTU0OTM3Njc4LCJleHAiOjE1NTQ5NDQ4NzgsImlzcyI6Im1vbmRheS5sdW5kaWkifQ.XBP-AmW9ssM6T3GYeQIY-GUGMu7vjR2bbXey3Hc0dUU')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res).to.be.a('object');
          expect(res.body).to.have.all.keys('status', 'error');
          expect(res.body.error).to.be.a('String');
          done();
        });
    });
  });
});
