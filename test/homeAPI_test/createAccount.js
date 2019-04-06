import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

const should = chai.should();
const expert = chai.expect;

chai.use(chaiHttp);

describe('/create API', () => {
  it('for testing create account API', (done) => {
    const body = {
      firstName: 'Onu',
      lastName: 'Monday',
      email: 'mondayemmauel67@gmail.com',
      sex: 'male',
      phoneNumber: 90890987909,
      dateOfBirth: new Date().getDate,
    };
    chai.request(server)
      .post('/create')
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('firstName');
        res.body.data.should.have.property('lastName');
        res.body.data.should.have.property('email');
        done();
      });
  });
});
