# Lab 11 single resource express api ![idle](./assets/siegward.gif)

## To run server
Clone down then run in terminal:
```
npm i
```
To start mongodb in terminal:
```
mongod --dbpath exampleDB
```
To start server in terminal:
```
node server.js
```
To run tests and lint files, make sure mongodb is running, then in terminal type:
```
gulp
```

## Using httpie to interact with server on the command line
To POST a new hit to the server:
```
http POST localhost:3000/api/hit "name=example hit name" "time=december" "location=seattle" "price=5 dollars"
```
To GET a hit from the server:
```
http GET localhost:3000/api/hit/exampleid
```
To GET all hits from the server:
```
http GET localhost:3000/api/hit/all
```
To DELETE a hit from the server:
```
http DELETE localhost:3000/api/hit/exampleid
```
To PUT new hit properties to existing hit on the server:
```
http PUT localhost:3000/api/hit/exampleid "name=example hit name" "time=december" "location=seattle" "price=new price"
```
