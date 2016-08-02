# Aliza Lab

Authentication Lab  

## How to use:  

- Git clone repo  
- Install dependencies with npm i
- Run 'mongod --dbpath ./db'  
- In another tab, run 'node server.js'
- Send a POST request in another tab with: http POST :3000/api/signup username=<String> basic= {email:<String>
  password:<String>}  
- Send a GET request with: http GET :3000/api/signin
- Run eslint and mocha tests by typing 'gulp' in the command line  
