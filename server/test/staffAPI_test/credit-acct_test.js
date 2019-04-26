/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server, { store } from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Staff can credit an account Number', () => {
  after((done) => {
    store.transactionStore.remove({ accountNumber: 1004870909 }, (err, result) => {
      done();
    });
  });
  it('should return a status 200 if the account is successfully credited', (done) => {
    const body = {
      email: 'amaka.padi@email.com',
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(body)
      .end((err, res) => {
        expect(res.body.data).to.include.all.keys('token');
        expect(res.body.data.token).to.be.a('String');
        const { token, id } = res.body.data;
        const body2 = {
          creditAmount: 20000,
        };
        chai.request(server)
          .post(`/api/v1/staff/${id}/transactions/1004870909/credit`)
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
  it('should return a status 400 if the amount is less than zero(0)', (done) => {
    const body = {
      email: 'amaka.padi@email.com',
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(body)
      .end((err, res) => {
        expect(res.body.data).to.include.all.keys('token');
        expect(res.body.data.token).to.be.a('String');
        const { token, id } = res.body.data;
        const body2 = {
          creditAmount: -200000,
        };
        chai.request(server)
          .post(`/api/v1/staff/${id}/transactions/1004870909/credit`)
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
  it('should return a status 401 if the user is not a staff(cahier)', (done) => {
    const body = {
      email: 'onumonday@email.com',
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(body)
      .end((err, res) => {
        expect(res.body.data).to.include.all.keys('token');
        expect(res.body.data.token).to.be.a('String');
        const { token, id } = res.body.data;
        const body2 = {
          creditAmount: 20000,
        };
        chai.request(server)
          .post(`/api/v1/staff/${id}/transactions/1004837498/credit`)
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
  it('should return a status 400 if account does not exit', (done) => {
    const body = {
      email: 'amaka.padi@email.com',
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(body)
      .end((err, res) => {
        expect(res.body.data).to.include.all.keys('token');
        expect(res.body.data.token).to.be.a('String');
        const { token, id } = res.body.data;
        const body2 = {
          creditAmount: 20000,
        };
        chai.request(server)
          .post(`/api/v1/staff/${id}/transactions/1004937498/credit`)
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
  it('should return a status 401 is user does not have a valid or expired token', (done) => {
    const body = {
      creditAmount: 20000,
    };
    const id = 50048987839302;
    chai.request(server)
      .post(`/api/v1/staff/${id}/transactions/100495432/credit`)
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
