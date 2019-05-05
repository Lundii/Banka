/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('User can view specific account transaction history', () => {
  it('should return a status 200 if the request is successful', (done) => {
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
        chai.request(server)
          .get(`/api/v1/user/${id}/accounts/1004848398/transactions`)
          .set('Authorization', token)
          .end((er, resp) => {
            const transId = resp.body.data[0].id;
            chai.request(server)
              .get(`/api/v1/user/${id}/transactions/${transId}`)
              .set('Authorization', token)
              .end((er1, resp1) => {
                expect(resp1).to.have.status(200);
                expect(resp1).to.be.a('object');
                expect(resp1.body).to.have.all.keys('status', 'data');
                expect(resp1.body.data).to.be.a('object');
                expect(resp1.body.data).to.include.all.keys('id', 'createdon', 'accountnumber', 'amount', 'type', 'oldbalance', 'newbalance');
                expect(resp1.body.data.accountnumber).to.be.a('Number');
                expect(resp1.body.data.id).to.be.a('Number');
                expect(resp1.body.data.amount).to.be.a('Number');
                expect(resp1.body.data.type).to.be.a('String');
                expect(resp1.body.data.oldbalance).to.be.a('Number');
                expect(resp1.body.data.newbalance).to.be.a('Number');
                done();
              });
          });
      });
  });
  it('should return a status 400 if transaction id is invalid/incorrect', (done) => {
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
        chai.request(server)
          .get(`/api/v1/user/${id}/1004848398/transactions`)
          .set('Authorization', token)
          .end((er, resp) => {
            chai.request(server)
              .get(`/api/v1/user/${id}/transactions/1211`)
              .set('Authorization', token)
              .end((er1, resp1) => {
                expect(resp1).to.have.status(400);
                expect(resp1).to.be.a('object');
                expect(resp1.body).to.have.all.keys('status', 'error');
                expect(resp1.body.error).to.be.a('String');
                done();
              });
          });
      });
  });
  it('should return a status 401 if the client is not a user (client)', (done) => {
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
        chai.request(server)
          .get(`/api/v1/user/${id}/transactions/76`)
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
  it('should return a status 401 is user does not have a valid or expired token', (done) => {
    const id = 50048987839302;
    chai.request(server)
      .get(`/api/v1/user/${id}/transactions/980`)
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
