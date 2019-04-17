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

## Heroku API

This application is hosted on heroku. Follow the [Heroku Link](https://mighty-retreat-71326.herokuapp.com/api/v1)

### Default Admin Account
Admin
```
{
    email: 'onumonday@gmail.com',
    password: 'password',
}
```

### Default Staff Account
Staff(Cashier)
```
{
    email: 'amaka.padi@gmail.com',
    password: 'password',
}
```

## API endpoints 

### Create a user account  `POST /auth/signup`   
#### Body   
```
{
  firstName: 'string',
  lastName: 'string',
  email: 'email',
  password: 'string',
  confirmPassword: 'string'
}
```
#### Response spec  
```
{
  “status” : Integer ,
  “data” : {
     “token” : “45erkjherht45495783”
     “id” : Integer , // id of newly created user
     “firstName” : String ,
     “lastName” : String ,
     “email” : String ,
     ...
   }
}
```    

### Login a user  `POST /auth/signin`    
#### Body   
```
{
  email: 'email',
  password: 'string',
}
```
#### Response spec 
```
{
  “status” : Integer ,
  “data” : {
    “token” : “45erkjherht45495783”
    “id” : Integer , // user id
    “firstName” : String ,
    “lastName” : String ,
    “email” : String ,
    ...
    }
}    
```

### Create a bank account  `POST /user/<_id>/accounts`   
#### Body   
```
{
  type: 'string' //savings or current
}
```
#### Response spec 
```
{
  “status” : Integer ,
    “data” : {
    “accountNumber” : Number ,
    “firstName” : String , // account owner first name
    “lastName” : String , // account owner last name
    “email” : String , // account owner email
    “type” : String , // savings, current
    “email” : String ,
    “openingBalance” : Float ,
    ...
    }
}
```   

### Activate or deactivate an account  `PATCH /staff(admin)/<_id>/account/<account-number>`    
#### Body   
```
{
  status: 'string' //active or domant
}
```
#### Response spec 
```
{
  “status” : Integer ,
    “data” : {
    “accountNumber” : Integer , // user unique id
    “status” : String , // active or dormant
    ...
  }
}
```

### Delete a specific bank account  `DELETE /accounts/<account-number>`  
#### Response spec
```
{
  “status” : Integer ,
  “message” : ”Account successfully deleted”
}
```
  
### Debit a bank account  `POST staff/<_id>/transactions/<account-number>/debit` 
#### Body
```
{
   debitAmount: "Integer"
}
```
#### Response spec
```
{
  “status” : Integer ,
  “data” : {
    “transactionId”: Integer ,
    “accountNumber” : String ,
    “amount” : Float ,
    “cashier” : Integer , // cashier that consumated the transaction
    “transactionType” : String,
    “accountBalance” : String,
  }
}
```   

### Credit a bank account  `POST staff/<_id>/transactions/<account-number>/credit`  
##### Body
```
{
   debitAmount: "Integer"
}
```
#### Response spec
```
{
  “status” : Integer ,
  “data” : {
    “transactionId”: Integer ,
    “accountNumber” : String ,
    “amount” : Float ,
    “cashier” : Integer , // cashier that consumated the transaction
    “transactionType” : String,
    “accountBalance” : String,
  }
}
```
