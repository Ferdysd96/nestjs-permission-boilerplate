<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Nestjs Permission Boilerplate
## Description

This is a basic [Nest](https://github.com/nestjs/nest) boilerplate project built on the more powerful node.js framework. The main purpose of this project is to dynamically handle roles and permissions assigned to the user

## Installation
- make sure you have [node.js](https://nodejs.org/) installed version 11+
- copy `.env.examaple` to `.env` and set environments for use
```bash
# install nodejs packages
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Database
Postgres is the database we use in the project, on the other hand you can install the package for your database and start enjoying.

```bash
# create database 
$ docker-compose up

# generate database structure
$ npm run migrate

# insert roles, permissions and users
$ npm run seed
```

## Swagger

- local: [`http://localhost:8080/api/v1/swagger`](http://localhost:8080/api/v1/swagger)
- token: [`JWT <token_generated_on_login>`](http://localhost:8080/api/v1/swagger/#/Auth/AuthController_login)

## Users
- username: `Admin` - password: `Hello123`

## Features

- [x]  [NestJS](https://github.com/nestjs/nest) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications
- [x]  [TypeORM](http://typeorm.io/) - ORM for TypeScript and JavaScript (ES7, ES6, ES5). Supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, WebSQL databases
- [x]  [TypeScript](https://github.com/Microsoft/TypeScript) - superset of JS which compiles to JS, providing compile-time type checking
- [x]  [Swagger ui](https://swagger.io/tools/swagger-ui) - allows you to visualize and interact with the API’s resources without having any of the implementation logic in placechecking
- [x]  [Passport](http://www.passportjs.org/packages/passport-jwt/) - a popular library used to implement JavaScript authentication (Facebook, Google+)
- [x]  [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - a JavaScript json web tokens implementation by auth0
- [x]  [pg](https://github.com/brianc/node-postgres) - Non-blocking PostgreSQL client for Node.js. Pure JavaScript and optional native libpq bindings


## Project Structure 

```
src
├── common
│  ├── decorators
│  ├── dtos
│  ├── enums
│  └── http
│     ├── exceptions
│     ├── http-error-type.ts
│     ├── http-exception.filter.ts
│     └── response.interceptor.ts
├── config
│  └── swagger.config.ts
├── database
│  ├── entities
│  │  └── base.entity.ts
│  ├── migrations
│  ├── seeds
│  ├── database.module.ts
│  └── database.providers.ts
├── helpers
│  └── hash.helper.ts
├── libs
│  └── pagination
├── modules
│  ├── admin
│  │  ├── access
│  │  │  ├── permissions
│  │  │  ├── roles
│  │  │  ├── users
│  │  │  └── access.module.ts
│  │  └── admin.module.ts    
│  └── auth
│     ├── decorators
│     ├── dtos
│     ├── enums
│     ├── guards
│     ├── services
│     ├── auth.controller.ts
│     ├── auth.module.ts
│     └── jwt.strategy.ts
├── app.module.ts
└── main.ts
```

## Stay in touch

- Author - [Ferdys Durán](https://github.com/Ferdysd96)
- Linkedin - [Ferdys Durán](https://www.linkedin.com/in/ferdys-dur%C3%A1n-055a10187/)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE)
