# Aliza Lab

Authorization Lab  

## How to use:  

- Git clone repo  
- Install dependencies with npm i  
- Create an APP_SECRET environmental variable in your bash profile
- Run 'mongod --dbpath ./db'  
- In another tab, run 'node server.js'  
- To sign-up, enter: http POST :3000/api/signup username=#UserName password=#password
- To sign-in, enter: http -a #username:#password :3000/api/signin  
- After signing in, you will get a token. Copy the token and save as environmental variable: export TOKEN=#yourToken  
- Create a new panda with: echo '{"name":"#pandaname", "favoriteColor": "#pandasFavoriteColor", "favoriteDance":"#pandasFavoriteDance"}' | http POST :3000/api/panda authorization:"Bearer $TOKEN"    
- Send a GET request with: http GET :3000/api/panda/$id  
- Run eslint with 'gulp eslint', mocha with 'gulp mocha', nodemon with 'gulp nodemon' or both mocha and eslint with the default of 'gulp'  
