/* eslint-disable no-trailing-spaces */
import path from 'path';

/**
 * Creates a router class for handling landing page APIs
 * @class
 */
export default class HomeRouter {
  /**
   * Constructor for creating the HomeRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  constructor(router, store) {
    this.router = router;
    this.bankAcctStore = store.bankAcctStore;
  }
  
  /**
   * Method used for routing
   */
  route() {
    this.router.route('/')
      .get((req, res) => {
        res.sendFile(path.join(__dirname, '../../', 'index.html'));
      });
    
    this.router.post('/create', (req, res) => {
      let result;
      // const {
      //   firstName, lastName, email, type,
      // } = req.body;
      // if (!firstName.length || !lastName.length || !email.length || !type.length) {
      //   res.status(400);
      //   result = {
      //     status: 400,
      //     error: 'Please fill all required fields',
      //   };
      // } else {
        this.bankAcctStore.create(req.body, (err, data) => {
          console.log('i sha got to this place');
          console.log(data);
        });
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
      // }
      res.send(result);
    });

    this.router.get('/accounts', (req, res) => {
      this.bankAcctStore.read({ firstName: 'Tuesday' }, (err, data) => {
        if (err) {
          res.send('Error loading files');
        }
        res.send(data);
      });
    });
    return this.router;
  }
}
