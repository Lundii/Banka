/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Admin can delete an account number', () => {
  describe('/DELECT delete an account Number', () => {
    it('should return a status 200 if the account is successfully deleted', (done) => {
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
          chai.request(server)
            .delete(`/api/v1/admin/${_id}/account/1004837498`)
            .set('Authorization', token)
            .end((er, resp) => {
              expect(resp).to.have.status(200);
              expect(resp).to.be.a('object');
              expect(resp.body).to.have.all.keys('status', 'message');
              expect(resp.body.message).to.be.a('String');
              done();
            });
        });
    });
  });
  describe('/DELECT delete an account Number', () => {
    it('should return a status 401 if the user is not a staff or admin', (done) => {
      const body = {
        email: 'petertunde@gmail.com',
        password: 'password',
      };
      chai.request(server)
        .post('/api/v1/auth/signin')
        .send(body)
        .end((err, res) => {
          expect(res.body.data).to.include.all.keys('token');
          expect(res.body.data.token).to.be.a('String');
          const { token, _id } = res.body.data;
          chai.request(server)
            .delete(`/api/v1/admin/${_id}/account/100495432`)
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
  describe('/DELECT delete an account Number', () => {
    it('should return a status 400 if account does not exit', (done) => {
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
          chai.request(server)
            .delete(`/api/v1/admin/${_id}/account/107495432`)
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
  describe('/DELECT delete an account Number', () => {
    it('should return a status 401 is user does not have a valid or expired token', (done) => {
      const _id = 50048987839302;
      chai.request(server)
        .delete(`/api/v1/admin/${_id}/account/100495432`)
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
