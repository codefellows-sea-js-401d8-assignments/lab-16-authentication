# Lab - Express Authentication
This is my submission for an authentication server. It allows a client to signup so long as they provide a unique username with a password. Also, they can signin with the same credentials and will receive a JSON web token.

## Installation
Clone down the repo then `npm install` to install dependencies. `mongodb` is required as well. It's recommended you use `HTTPie`.

## Directions
Prior to running any part of the server, make sure and setup a `process.env.APP_SECRET` variable via the command line. This can be done by typing `export APP_SECRET=secretvariable`.

Next, make a folder in the root directory of the cloned project named `db`. Run `mongodb` by typing `mongod --dbpath db` to establish where the database will be stored. Finally, run mongo by typing `mongod`.

## Signup
This is done via a POST request. The format to follow is `http :3000/api/auth/signup username=james password=helloworld`. The server will respond with a `JSON web token`.

## Signin
This is done via a GET request. The format to follow is `http -a username:password :3000/api/auth/signin`. The server will respond with a JSON web token if successfully authenticated.

## Testing
To test using `gulp`, simply type `gulp` or `gulp task_name` for specific tasks. Otherwise, type `mocha` or `npm test`.
