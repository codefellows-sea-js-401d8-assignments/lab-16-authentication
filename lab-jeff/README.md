![Triforce](./resources/triforce2.gif)

#Bcrypt Authentication with Mongo and Express#

###Summary###
A basic Authentication server.


###Instructions###
From the root directory of 'lab-jeff' run the following command in your terminal:

`npm install`

Assuming you have mongoDB installed on your machine, next start mongod by running:

`mongod --dbpath db`

To run the linter, watcher and start the server type the command:
`gulp`

Using HTTPie or you prefered HTTP request interface run the following commands:

Signup: `http POST :3000/api/user/signup "username=test" "password=password"`

Signin: `http -a test:password :3000/api/user/signin`

Once you have signed in, it will return a token, save this token.

Add bank account: `http POST :3000/api/account Authorization:"Bearer yourTokenGoesHere" "accountType=savings" "accountNumber=12345"`

Get all bank accounts: `http :3000/api/account`



###Test###

To run all tests, type the following command:

`mocha`



`Jeff Gebhardt - CF JS 401`
