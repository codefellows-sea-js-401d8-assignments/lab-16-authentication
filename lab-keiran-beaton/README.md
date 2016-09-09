# Lab 16 Authentication

## Setting up
run `npm install` to install all the necessary dependencies


## Using the app

run `mongod --dbpath ./db` to start mongo
run `node server` to start the server

to sign up, make a post request to 'localhost:3000/api/signup', sending an object with the following structure:
```
{username: {type: String, required: true, unique: true}, basic: {email: {type: String, required: true, unique: true}, password: {type: String, required: true}}}
```
to sign in, make a get request to 'localhost:3000/api/signin' after signing up

## Testing

To lint all files and run tests, start mongo with `mongod --dbpath ./db` then run `gulp` in the command line. There are two linter errors but they are both for unused var next in the server and test-harness respectively.

Keiran Beaton
