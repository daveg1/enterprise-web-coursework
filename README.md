# enterprise-web-coursework

CM4025 Enterprise Web App coursework. This app gives a quote on the estimated budget for a project, based on physical and human resources. The human resources are workers with varying pay grades and time spent working, while physical resources include one-off and ongoing payments.

The webapp follows a MEAN stack architecture (MongoDB, Express, Angular, Node). The frontend code is stored in [angular/](./angular/) and the backend in [api/](./api/).

## Architecture

### Frontend

The frontend is built using [Angular v15](https://angular.io/). Components are styled using [Tailwind CSS](https://tailwindcss.com/). Pages include:

- /
- /calculator
- /quote
- /login
- /signup
- /account
- /admin

### Backend

The API is a Node app running an [Express](https://expressjs.com/) server. [TypeScript](https://www.typescriptlang.org/) is used to enforce strict typing. [Zod](https://zod.dev/) is used to validate API requests. [Mongoose](https://mongoosejs.com/docs/) is used to enforce schemas for MongoDB. Routes include:

- /auth/signup
- /auth/login
- /auth/delete
- /quote/calculate
- /quote/save
- /quote/delete
- /quote/user

### Database

MongoDB is used as the database.

## Setup

This project is designed to run on a server installed with Ubuntu 22.04 OS. The node processes (angular and api) are managed with [PM2](https://pm2.keymetrics.io/) and the database runs as a local MongoDB instance.

To set this project up, please run the script provided in the submission.

## References

- [How To Use Tailwindcss with Express](https://daily.dev/blog/how-to-use-tailwindcss-with-node-js-express-and-pug#add-tailwindcss)
- [Using Zod for Request Body Validation](https://dev.to/franciscomendes10866/schema-validation-with-zod-and-expressjs-111p)
- [Zod 3.20.2 Causes Slow TypeScript Autocompletion](https://stackoverflow.com/a/74901864)
- [Password Storage OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Angular Authentication using JWTs (playlist)](https://youtube.com/playlist?list=PLhzRPVQgdM8XDD5abg0helsgs_o5nEF06)
- [Dynamic Form Groups in Angular using FormArray](https://blog.angular-university.io/angular-form-array/)
- [Unsubscribe from http observables](https://stackoverflow.com/a/57274287)
- [@angular/cdk dialogs](https://material.angular.io/cdk/dialog/overview)
