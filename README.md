# enterprise-web-coursework

CM4025 Enterprise Web App coursework. This app gives a quote on the estimated budget for a project, based on physical and human resources. The human resources are workers with varying pay grades and time spent working, while physical resources include one-off and ongoing payments.

The webapp follows a MEAN stack architecture (MongoDB, Express server, Angular frontend, Node environment). The frontend code is stored in [angular/](./angular/) and the backend in [api/](./api/).

## Architecture

### Frontend

The frontend is built using [Angular v15](https://angular.io/). Components are styled using [Tailwind CSS](https://tailwindcss.com/). Pages include:

- /
- /login
- /signup
- /account

### Backend

The API is a Node app running an Express server. [TypeScript](https://www.typescriptlang.org/) is used to enforce strict typing. [Zod](https://zod.dev/) is used to validate API requests. [Mongoose](https://mongoosejs.com/docs/) is used to validate requests to MongoDB. Routes include:

- /account
  - /new
- /budget

### Database

MongoDB is used as the database.

### Platform

The webapp and database are run on a server installed with Ubuntu 22.04 OS. The webapp processes are managed with [PM2](https://pm2.keymetrics.io/), while the database runs as a local MongoDB instance.

## Usage

In order to run this web app, please run the following start up script:
[todo]

Once the setup is completed, cd into each project (angular/ and api/) in separate terminal windows and run the following respectively:

- angular: `ng serve`
- api: `npm start`

## References

- [How To Use Tailwindcss with Express](https://daily.dev/blog/how-to-use-tailwindcss-with-node-js-express-and-pug#add-tailwindcss)
- [Using Zod for Request Body Validation](https://dev.to/franciscomendes10866/schema-validation-with-zod-and-expressjs-111p)
- [Zod 3.20.2 Causes Slow TypeScript Autocompletion](https://stackoverflow.com/a/74901864)
- [Password Storage OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Angular Authentication using JWTs (playlist)](https://youtube.com/playlist?list=PLhzRPVQgdM8XDD5abg0helsgs_o5nEF06)
- [Dynamic Form Groups in Angular using FormArray](https://blog.angular-university.io/angular-form-array/)
