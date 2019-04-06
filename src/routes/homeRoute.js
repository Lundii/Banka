import path from 'path';

export default class HomeRouter {
  constructor(router) {
    this.router = router;
  }

  route() {
    this.router.get('/', (req, res) => {
      const response = {
        status: 200,
        data: {
          message: 'this is home',
        },
      };
      res.sendFile(path.join(__dirname, '../../', 'index.html'));
    });

    this.router.post('/create', (req, res) => {
      const response = {
        status: 200,
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
      };
      res.send(response);
    });
    return this.router;
  }
}
