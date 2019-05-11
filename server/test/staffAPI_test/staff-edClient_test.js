/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Staff can edit client details', () => {
  it('should return a status 200 if the request is successful', (done) => {
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
          email: 'edituser@email.com',
          password: 'password',
        };
        chai.request(server)
          .post('/api/v1/auth/signin')
          .send(body2)
          .end((err1, res1) => {
            expect(res1.body.data).to.include.all.keys('token');
            expect(res1.body.data.token).to.be.a('String');
            const clientEmail = res1.body.data.email;
            const body3 = {
              clientEmail,
              firstName: 'Halimat',
              lastName: 'Disu',
            };
            chai.request(server)
              .patch(`/api/v1/staff/${id}/users`)
              .send(body3)
              .set('Authorization', token)
              .end((err2, res2) => {
                expect(res2).to.have.status(200);
                expect(res2).to.be.a('object');
                expect(res2.body).to.have.all.keys('status', 'data');
                expect(res2.body.data).to.include.all.keys('firstName', 'lastName', 'email');
                expect(res2.body.data.firstName).to.be.a('String');
                expect(res2.body.data.lastName).to.be.a('String');
                expect(res2.body.data.email).to.be.a('String');
                done();
              });
          });
      });
  });
  it('should return a status 400 if clientEmail is not present', (done) => {
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
          email: 'edituser@email.com',
          password: 'password',
        };
        chai.request(server)
          .post('/api/v1/auth/signin')
          .send(body2)
          .end((err1, res1) => {
            expect(res1.body.data).to.include.all.keys('token');
            expect(res1.body.data.token).to.be.a('String');
            const body3 = {
              firstname: 'Halimat',
              lastname: 'Disu',
            };
            chai.request(server)
              .patch(`/api/v1/staff/${id}/users`)
              .send(body3)
              .set('Authorization', token)
              .end((err2, res2) => {
                expect(res2).to.have.status(400);
                expect(res2).to.be.a('object');
                expect(res2.body).to.have.all.keys('status', 'error');
                expect(res2.body.error).to.be.a('String');
                done();
              });
          });
      });
  });
  it('should return a status 400 if clientEmail is invalid', (done) => {
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
          email: 'edituser@email.com',
          password: 'password',
        };
        chai.request(server)
          .post('/api/v1/auth/signin')
          .send(body2)
          .end((err1, res1) => {
            expect(res1.body.data).to.include.all.keys('token');
            expect(res1.body.data.token).to.be.a('String');
            const body3 = {
              clientEmail: 'invalid.com',
              firstname: 'Halimat',
              lastname: 'Disu',
            };
            chai.request(server)
              .patch(`/api/v1/staff/${id}/users`)
              .send(body3)
              .set('Authorization', token)
              .end((err2, res2) => {
                expect(res2).to.have.status(400);
                expect(res2).to.be.a('object');
                expect(res2.body).to.have.all.keys('status', 'error');
                expect(res2.body.error).to.be.a('String');
                done();
              });
          });
      });
  });
  it('should return a status 401 if user is not a staff', (done) => {
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
          email: 'edituser@email.com',
          password: 'password',
        };
        chai.request(server)
          .post('/api/v1/auth/signin')
          .send(body2)
          .end((err1, res1) => {
            expect(res1.body.data).to.include.all.keys('token');
            expect(res1.body.data.token).to.be.a('String');
            const clientEmail = res.body.data.email;
            const body3 = {
              clientEmail,
              firstname: 'Halimat',
              lastname: 'Disu',
            };
            chai.request(server)
              .patch(`/api/v1/staff/${id}/users`)
              .send(body3)
              .set('Authorization', token)
              .end((err2, res2) => {
                expect(res2).to.have.status(401);
                expect(res2).to.be.a('object');
                expect(res2.body).to.have.all.keys('status', 'error');
                expect(res2.body.error).to.be.a('String');
                done();
              });
          });
      });
  });
  it('should return a status 401 is user does not have a valid or expired token', (done) => {
    const id = 50048987839302;
    chai.request(server)
      .patch(`/api/v1/staff/${id}/users`)
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
