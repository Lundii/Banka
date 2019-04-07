import path from 'path';

export default class HomeRouter {
  constructor(router) {
    this.router = router;
  }

  route() {
    this.router.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../../', 'index.html'));
    });
    this.router.post('/create', (req, res) => {
      let result;
      const {
        firstName, lastName, email, type,
      } = req.body;
      if (!firstName.length || !lastName.length || !email.length || !type.length) {
        res.status(400);
        result = {
          status: 400,
          error: 'Please fill all required fields',
        };
      } else {
        res.status(200);
        result = {
          status: 200,
          data: {
            accountNumber: 1235432678,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: 'somethihg@gmail.com',
            type: 'current',
          },
        };
      }
      res.send(result);
    });
    return this.router;
  }
}
