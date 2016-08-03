# Aliza Lab

Authentication Lab  

## How to use:  

- Git clone repo  
- Install dependencies with npm i  
- Create an APP_SECRET environmental variable in your bash profile
- Run 'mongod --dbpath ./db'  
- In another tab, run 'node server.js'  
- To sign-up, enter: echo '{"email":"<email>", "password": "<password>"}' | http :3000/api/signup
- To sign-in, enter: http -a <email>:<password> :3000/api/signin
- Run eslint with 'gulp eslint', mocha with 'gulp mocha', nodemon with 'gulp nodemon' or both mocha and eslint with the default of 'gulp'  
