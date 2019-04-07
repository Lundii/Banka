import path from 'path';

export default class HomeRouter {
  constructor(router) {
    this.router = router;
  }

  route() {
    this.router.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../../', 'index.html'));
    });
    return this.router;
  }
}
