/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('User can buy airtime from their account', () => {
  it('should return a status 200 if the airtime purchase is successful', (done) => {
    const body = {
      email: 'aishalawal23@email.com',
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
          airtimeAmount: 2000,
          network: 'mtn',
          phoneNumber: '07068989767',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1003437498/airtime`)
          .send(body2)
          .set('Authorization', token)
          .end((er, resp) => {
            console.log(resp.body);
            expect(resp).to.have.status(200);
            expect(resp).to.be.a('object');
            expect(resp.body).to.have.include.all.keys('status', 'data');
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
  it('should return a status 400 if the amount is greater than available balance', (done) => {
    const body = {
      email: 'aishalawal23@email.com',
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
          airtimeAmount: 20000000,
          network: 'mtn',
          phoneNumber: '07068989767',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1003437498/airtime`)
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
  it('should return a status 400 if the phone number is not a valid network number', (done) => {
    const body = {
      email: 'aishalawal23@email.com',
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
          airtimeAmount: 2000,
          network: 'mtn',
          phoneNumber: '07058989767',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1003437498/airtime`)
          .send(body2)
          .set('Authorization', token)
          .end((er, resp) => {
            console.log(resp.body);
            expect(resp).to.have.status(400);
            expect(resp).to.be.a('object');
            expect(resp.body).to.have.all.keys('status', 'error');
            expect(resp.body.error).to.be.a('String');
            done();
          });
      });
  });
  it('should return a status 400 if the amount is less than zero(0)', (done) => {
    const body = {
      email: 'aishalawal23@email.com',
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
          airtimeAmount: -20000,
          network: 'mtn',
          phoneNumber: '07068989767',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1003437498/airtime`)
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
  it('should return a status 400 if airtimeAmount is not present', (done) => {
    const body = {
      email: 'aishalawal23@email.com',
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
          network: 'mtn',
          phoneNumber: '07068989767',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1003437498/airtime`)
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
  it('should return a status 400 if network is not present', (done) => {
    const body = {
      email: 'aishalawal23@email.com',
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
          airtimeAmount: 2000,
          phoneNumber: '07068989767',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1003437498/airtime`)
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
  it('should return a status 400 if phoneNumber is not present', (done) => {
    const body = {
      email: 'aishalawal23@email.com',
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
          airtimeAmount: 2000,
          network: 'mtn',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1003437498/airtime`)
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
  it('should return a status 400 if the account is dormant', (done) => {
    const body = {
      email: 'peter123tunde@email.com',
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
          airtimeAmount: 20000,
          network: 'mtn',
          phoneNumber: '07068989767',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1004870909/airtime`)
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
  it('should return a status 401 if the user is not a client', (done) => {
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
          airtimeAmount: 20000,
          network: 'mtn',
          phoneNumber: '07068989767',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1003437498/airtime`)
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
  it('should return a status 401 if account number does not belong to user', (done) => {
    const body = {
      email: 'peter123tunde@email.com',
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
          airtimeAmount: 2000,
          network: 'mtn',
          phoneNumber: '07068989767',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1003437498/airtime`)
          .send(body2)
          .set('Authorization', token)
          .end((er, resp) => {
            console.log(resp.body)
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
      email: 'chukwudi.james@email.com',
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
          airtimeAmount: 20000,
          network: 'mtn',
          phoneNumber: '07068989767',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/transactions/1004930098/airtime`)
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
      airtimeAmount: 20000,
      network: 'mtn',
      phoneNumber: '07068989767',
    };
    const id = 50048987839302;
    chai.request(server)
      .post(`/api/v1/user/${id}/transactions/100495432/airtime`)
      .send(body)
      .set('Authorization', 'ghjklldiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXkljE5hbWUiOiJtb25kYXkiLCJlbWFpbCI6Im1vfyRheXR1ZXNkYXlAZ21haWwuY29tIiwiaWF0IjoxNTU0OTM3Njc4LCJleHAiOjE1NTQ5NDQ4NzgsImlzcyI6Im1vbmRheS5sdW5kaWkifQ.XBP-AmW9ssM6T3GYeQIY-GUGMu7vjR2bbXey3Hc0dUU')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
});
