/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Staff can debite an account Number', () => {
  describe('/POST delete an account Number', () => {
    it('should return a status 200 if the account is successfully debited', (done) => {
      const body = {
        email: 'amaka.padi@gmail.com',
        password: 'password',
      };
      chai.request(server)
        .post('/api/v1/auth/signin')
        .send(body)
        .end((err, res) => {
          expect(res.body.data).to.include.all.keys('token');
          expect(res.body.data.token).to.be.a('String');
          const { token, _id } = res.body.data;
          const body2 = {
            debitAmount: 20000,
          };
          chai.request(server)
            .post(`/api/v1/staff/${_id}/transactions/1004870909/debit`)
            .send(body2)
            .set('Authorization', token)
            .end((er, resp) => {
              expect(resp).to.have.status(200);
              expect(resp).to.be.a('object');
              expect(resp.body).to.have.all.keys('status', 'data');
              expect(resp.body.data).to.include.all.keys('transactionId', 'accountNumber', 'amount', 'cashier', 'transactionType', 'accountBalance');
              expect(resp.body.data.transactionId).to.be.a('Number');
              expect(resp.body.data.accountNumber).to.be.a('String');
              expect(resp.body.data.amount).to.be.a('Number');
              expect(resp.body.data.cashier).to.be.a('Number');
              expect(resp.body.data.accountBalance).to.be.a('String');
              done();
            });
        });
    });
  });
  describe('/POST delete an account Number', () => {
    it('should return a status 400 if the amount is greater than available balance', (done) => {
      const body = {
        email: 'amaka.padi@gmail.com',
        password: 'password',
      };
      chai.request(server)
        .post('/api/v1/auth/signin')
        .send(body)
        .end((err, res) => {
          expect(res.body.data).to.include.all.keys('token');
          expect(res.body.data.token).to.be.a('String');
          const { token, _id } = res.body.data;
          const body2 = {
            debitAmount: 200000,
          };
          chai.request(server)
            .post(`/api/v1/staff/${_id}/transactions/1003847890/debit`)
            .send(body2)
            .set('Authorization', token)
            .end((er, resp) => {
              expect(resp).to.have.status(400);
              expect(resp).to.be.a('object');
              expect(resp.body).to.have.all.keys('status', 'error');
              expect(resp.body.error).to.be.a('String');
              done();
            });
        });
    });
  });
  describe('/POST delete an account Number', () => {
    it('should return a status 400 if the account is dormant', (done) => {
      const body = {
        email: 'amaka.padi@gmail.com',
        password: 'password',
      };
      chai.request(server)
        .post('/api/v1/auth/signin')
        .send(body)
        .end((err, res) => {
          expect(res.body.data).to.include.all.keys('token');
          expect(res.body.data.token).to.be.a('String');
          const { token, _id } = res.body.data;
          const body2 = {
            debitAmount: 200000,
          };
          chai.request(server)
            .post(`/api/v1/staff/${_id}/transactions/1004837498/debit`)
            .send(body2)
            .set('Authorization', token)
            .end((er, resp) => {
              expect(resp).to.have.status(400);
              expect(resp).to.be.a('object');
              expect(resp.body).to.have.all.keys('status', 'error');
              expect(resp.body.error).to.be.a('String');
              done();
            });
        });
    });
  });
  describe('/POST credit an account Number', () => {
    it('should return a status 401 if the user is not a staff(cahier)', (done) => {
      const body = {
        email: 'onumonday@gmail.com',
        password: 'password',
      };
      chai.request(server)
        .post('/api/v1/auth/signin')
        .send(body)
        .end((err, res) => {
          expect(res.body.data).to.include.all.keys('token');
          expect(res.body.data.token).to.be.a('String');
          const { token, _id } = res.body.data;
          const body2 = {
            debitAmount: 20000,
          };
          chai.request(server)
            .post(`/api/v1/staff/${_id}/transactions/1004837498/credit`)
            .send(body2)
            .set('Authorization', token)
            .end((er, resp) => {
              expect(resp).to.have.status(401);
              expect(resp).to.be.a('object');
              expect(resp.body).to.have.all.keys('status', 'error');
              expect(resp.body.error).to.be.a('String');
              done();
            });
        });
    });
  });
  describe('/POST credit an account Number', () => {
    it('should return a status 400 if account does not exit', (done) => {
      const body = {
        email: 'amaka.padi@gmail.com',
        password: 'password',
      };
      chai.request(server)
        .post('/api/v1/auth/signin')
        .send(body)
        .end((err, res) => {
          expect(res.body.data).to.include.all.keys('token');
          expect(res.body.data.token).to.be.a('String');
          const { token, _id } = res.body.data;
          const body2 = {
            debitAmount: 20000,
          };
          chai.request(server)
            .post(`/api/v1/staff/${_id}/transactions/1004930098/debit`)
            .send(body2)
            .set('Authorization', token)
            .end((er, resp) => {
              expect(resp).to.have.status(400);
              expect(resp).to.be.a('object');
              expect(resp.body).to.have.all.keys('status', 'error');
              expect(resp.body.error).to.be.a('String');
              done();
            });
        });
    });
  });
  describe('/POST credit an account Number', () => {
    it('should return a status 401 is user does not have a valid or expired token', (done) => {
      const body = {
        debitAmount: 20000,
      };
      const _id = 50048987839302;
      chai.request(server)
        .post(`/api/v1/staff/${_id}/transactions/100495432/debit`)
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
