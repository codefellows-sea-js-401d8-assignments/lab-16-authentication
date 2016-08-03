Summary:

Built a basic Authentication Server using express.

Instructions:

make sure to be in the root folder tre-lab and enter:
```
npm install
```
next:
```
mongod --dbpath db
```
next:
```
gulp
```
Making a request:

Signup:
```
http POST :3000/api/user/signup "username=test" "password=password"
```
Signin:
```
http -a test:password :3000/api/user/signin
```
Running test:
```
mocha
```
