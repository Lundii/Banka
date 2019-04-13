# Banka 
![TravisCI batch](https://travis-ci.org/Lundii/Banka.svg?branch=develop) [![Test Coverage](https://api.codeclimate.com/v1/badges/ee1940768b5df0066b5a/test_coverage)](https://codeclimate.com/github/Lundii/Banka/test_coverage)  [![npm version](https://badge.fury.io/js/node.svg)](https://badge.fury.io/js/node) [![Maintainability](https://api.codeclimate.com/v1/badges/ee1940768b5df0066b5a/maintainability)](https://codeclimate.com/github/Lundii/Banka/maintainability)  [![Coverage Status](https://coveralls.io/repos/github/Lundii/Banka/badge.svg)](https://coveralls.io/github/Lundii/Banka) 

Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals.

## Features
```
* User (client) can sign up.
* User (client) can login.
* User (client) can create an account.
* User (client) can view account transaction history.
* User (client) can view a specific account transaction.
* Staff (cashier) can debit user (client) account.
* Staff (cashier) can credit user (client) account.
* Admin/staff can view all user accounts.
* Admin/staff can view a specific user account.
* Admin/staff can activate or deactivate an account.
* Admin/staff can delete a specific user account.
* Admin can create staff and admin user accounts.
```
## UI Templates

Navigate to the [Github pages link](https://lundii.github.io/Banka/) to view the UI templates

## Pivatal tracker

Pivotal tracker was used as a project managment tool through out the development of the application. To see the different stories visit the project [link](https://www.pivotaltracker.com/n/projects/2320895)

## API endpoints 

**Create a user account**  `POST /auth/signup`   
**Login a user**  `POST /auth/signin`    
**Create a bank account**  `POST /accounts`    
**Activate or deactivate an account**  `PATCH /account/<account-number>`    
**Delete a specific bank account**  `DELETE /accounts/<account-number>`    
**Debit a bank account**  `POST /transactions/<account-number>/debit`   
**Credit a bank account**  `POST /transactions/<account-number>/credit`  
