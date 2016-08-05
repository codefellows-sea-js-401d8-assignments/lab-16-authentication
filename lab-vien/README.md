# Lab 17 authorization ![idle](./assets/siegward.gif)

## To run server
Clone down then run in terminal:
```
npm i
```
To start mongodb in terminal:
```
mongod --dbpath db
```
To start server in terminal:
```
node server.js
```
To lint files, in terminal type:
```
gulp
```

To run tests, make sure mongodb is running, then in terminal:
```
mocha
```


## Using httpie to interact with server on the command line
### Make sure mongodb is running
To SIGNUP for a basic token (save this token as environment variable BASICTOKEN for further testing):
```
http localhost:3000/api/signup "username=example username" "email=example email" "password=example password"
```
To SIGNUP for an admin token (save this token as environment variable ADMINTOKEN for further testing):
```
http localhost:3000/api/signup "username=example username" "email=example email" "password=example password" "role=admin"
```
To SIGNIN:
```
http localhost:3000/api/signin "username=example username" "password=example password"
```
To POST to the simple resource database (admin credentials required):
```
http POST localhost:3000/api/shanesgroupie "Authorization:Bearer $ADMINTOKEN" "name=example name" age=99 "location=example location"
```
To GET a list of simple resources (basic or admin credentials required):
```
http GET localhost:3000/api/shanesgroupie "Authorization:Bearer $BASICTOKEN"
```
To PUT a the simple resource in database (admin credentials required):
```
http PUT localhost:3000/api/shanesgroupie/exampleid "Authorization:Bearer $ADMINTOKEN" "name=example name" age=99 "location=example location"
```
To DELETE a simple resource (admin credentials required):
```
http DELETE localhost:3000/api/shanesgroupie/exampleid "Authorization:Bearer $ADMINTOKEN"
```
