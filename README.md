# Server

* Implemented using [Nest](https://github.com/nestjs/nest) framework.
* Swagger documentation is available at: https://umob.ogin.io/docs
* Api is available at: https://umob.ogin.io/api

### Installation

```bash
$ yarn install
```

### Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Test
On each pull request a github action will run the tests.

```bash
# e2e tests
$ yarn run test:e2e
```

# Infrastructure

* Implemented using terraform and deployed on AWS.
* The infrastructure code is inside the `infrastructure` folder.
* On each push to `main` branch a github action will run the terraform script and deploy the infrastructure.

# Client

* Implemented using python.
* The client code is inside the `client` folder.

### Running the client app

```bash
$ cd client
$ pip install -r requirements.txt
$ python main.py
```
