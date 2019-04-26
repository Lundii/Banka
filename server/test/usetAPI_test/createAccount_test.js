/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server, { store } from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Create Bank Account', () => {
  after((done) => {
    store.userStore.remove({ email: 'differentmail@email.com' }, (err, result) => {
      done();
    });
  });
  // it('should return a status 200 if user is registered and have a valid token', (done) => {
  //   const body = {
  //     firstName: 'Sunday',
  //     lastName: 'Monday',
  //     email: 'differentmail@email.com',
  //     password: 'password',
  //     confirmPassword: 'password',
  //   };
  //   chai.request(server)
  //     .post('/api/v1/auth/signup')
  //     .send(body)
  //     .end((err, res) => {
  //       expect(res.body.data).to.include.all.keys('token');
  //       expect(res.body.data.token).to.be.a('String');
  //       const { token, id } = res.body.data;
  //       const body2 = {
  //         email: res.body.data.email,
  //         type: 'savings',
  //       };
  //       chai.request(server)
  //         .get(`/api/v1/user/${id}/confirmEmail/${token}`)
  //         .end((err1, res1) => {
  //           chai.request(server)
  //             .post(`/api/v1/user/${id}/accounts`)
  //             .send(body2)
  //             .set('Authorization', token)
  //             .end((er, resp) => {
  //               expect(resp).to.have.status(200);
  //               expect(resp).to.be.a('object');
  //               expect(resp.body).to.have.all.keys('status', 'data');
  //               expect(resp.body.data).to.include.all.keys('accountNumber', 'firstName', 'lastName', 'email', 'type', 'openingBalance');
  //               expect(resp.body.data.accountNumber).to.be.a('Number');
  //               expect(resp.body.data.firstName).to.be.a('String');
  //               expect(resp.body.data.lastName).to.be.a('String');
  //               expect(resp.body.data.email).to.be.a('String');
  //               expect(resp.body.data.type).to.be.a('String');
  //               expect(resp.body.data.openingBalance).to.be.a('Number');
  //               store.bankAcctStore.remove({ accountNumber: resp.body.data.accountNumber }, (error, re) => {
  //                 done();
  //               });
  //             });
  //         });
  //     });
  // });
  it('should return a status 403 if email is not confirmed', (done) => {
    const body = {
      firstName: 'Sunday',
      lastName: 'Monday',
      email: 'differentmail@email.com',
      password: 'password',
      confirmPassword: 'password',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(body)
      .end((err, res) => {
        expect(res.body.data).to.include.all.keys('token');
        expect(res.body.data.token).to.be.a('String');
        const { token, id } = res.body.data;
        const body2 = {
          email: res.body.data.email,
          type: 'savings',
        };
        chai.request(server)
          .post(`/api/v1/user/${id}/accounts`)
          .send(body2)
          .set('Authorization', token)
          .end((er, resp) => {
            expect(resp).to.have.status(403);
            expect(resp).to.be.a('object');
            expect(resp.body).to.have.all.keys('status', 'message');
            expect(resp.body.message).to.be.a('String');
            done();
          });
      });
  });
  it('should return a status 401 is user does not have a valid or expired token', (done) => {
    const body = {
      email: 'differentmail@email.com',
      type: 'savings',
    };
    chai.request(server)
      .post('/api/v1/user/50087744345864345/accounts')
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
