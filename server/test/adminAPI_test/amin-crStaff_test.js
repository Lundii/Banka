/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server, { store } from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Admin can create new staffs', () => {
  after((done) => {
    store.userStore.remove({ email: 'admin2@email.com' }, (err, result) => {
      done();
    });
  });
  it('should return a status 200 if the request is successful', (done) => {
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
          firstName: 'Onu',
          lastName: 'Wednesday',
          email: 'admin2@email.com',
          isadmin: false,
        };
        chai.request(server)
          .post(`/api/v1/admin/${id}/users`)
          .send(body2)
          .set('Authorization', token)
          .end((er, resp) => {
            expect(resp).to.have.status(200);
            expect(resp).to.be.a('object');
            expect(resp.body).to.have.all.keys('status', 'data');
            expect(resp.body.data).to.be.a('object');
            expect(resp.body.data).to.include.all.keys('firstname', 'lastname', 'email', 'type', 'isadmin');
            expect(resp.body.data.firstname).to.be.a('String');
            expect(resp.body.data.lastname).to.be.a('String');
            expect(resp.body.data.email).to.be.a('String');
            expect(resp.body.data.type).to.be.a('String');
            expect(resp.body.data.isadmin).to.be.a('boolean');
            expect(resp.body.data.isadmin).to.equals(false);
            done();
          });
      });
  });
  it('should return a status 400 if firstName field is omitted', (done) => {
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
          lastName: 'Wednesday',
          email: 'onumonday@email.com',
          isadmin: false,
        };
        chai.request(server)
          .post(`/api/v1/admin/${id}/users`)
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
  it('should return a status 400 if lastName field is omitted', (done) => {
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
          firstName: 'Wednesday',
          email: 'onumonday@email.com',
          isadmin: false,
        };
        chai.request(server)
          .post(`/api/v1/admin/${id}/users`)
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
  it('should return a status 400 if email field is omitted', (done) => {
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
          firstName: 'Tuesday',
          lastName: 'Wednesday',
          isadmin: false,
        };
        chai.request(server)
          .post(`/api/v1/admin/${id}/users`)
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
  it('should return a status 400 if isadmin field is omitted', (done) => {
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
          firstName: 'Tuesday',
          lastName: 'Wednesday',
          email: 'onumonday@email.com',
        };
        chai.request(server)
          .post(`/api/v1/admin/${id}/users`)
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
  it('should return a status 400 if email is invalid', (done) => {
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
          firstName: 'Tuesday',
          lastName: 'Wednesday',
          email: 'onumonday@.com',
          isadmin: false,
        };
        chai.request(server)
          .post(`/api/v1/admin/${id}/users`)
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
  it('should return a status 400 if email is already exits', (done) => {
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
          firstName: 'Tuesday',
          lastName: 'Wednesday',
          email: 'onumonday@email.com',
          isadmin: false,
        };
        chai.request(server)
          .post(`/api/v1/admin/${id}/users`)
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
  it('should return a status 400 if firstname or lastname contains invalid character', (done) => {
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
          firstName: 'Tues4day',
          lastName: 'Wedne sday',
          email: 'admin2@email.com',
          isadmin: false,
        };
        chai.request(server)
          .post(`/api/v1/admin/${id}/users`)
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
  it('should return a status 400 if is isadmin is not equal true or false', (done) => {
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
          firstName: 'Tuesday',
          lastName: 'Wednesday',
          email: 'admin2@email.com',
          isadmin: 'something else',
        };
        chai.request(server)
          .post(`/api/v1/admin/${id}/users`)
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
  it('should return a status 401 if the user is not a admin', (done) => {
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
          firstName: 'Onu',
          lastName: 'Wednesday',
          email: 'onumonday@email.com',
          isadmin: false,
        };
        chai.request(server)
          .post(`/api/v1/admin/${id}/users`)
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
  it('should return a status 401 is user does not have a valid or expired token', (done) => {
    const id = 50048987839302;
    chai.request(server)
      .post(`/api/v1/admin/${id}/users`)
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
