/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Reset password route', () => {
  it('should return a status 200 if route is reached', (done) => {
    chai.request(server)
      .get('/api/v1/passwordreset')
      .end((err, res) => {
        expect(res).to.be.html;
        done();
      });
  });
  it('should return a status 400 if user is invalid', (done) => {
    chai.request(server)
      .post('/api/v1/passwordreset_form')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
  it('should return a status 400 if user is invalid', (done) => {
    chai.request(server)
      .get('/api/v1/passwordreset_form/3423/werfgjiuiytgj')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body.error).to.be.a('String');
        done();
      });
  });
});
