## Front end ##
The front end of the project used React and babel. It cominucates with the backend througth a API Rest

## Back end ##
The Back end handdles the resquest and response of the API Rest.

Additionally, I used the following packages and utils:

express 
It is a package that let us development the app easier.

nodemon
It is used to avoid restart express app manually. You need to install globally 
(use npm install -g nodemon) or using npx nodemon to run it instead.
Run the app: nodemon index

body-parser
It is used to parse the json sended to the server.
Install: npm install body-parser --save

mongoose
It is used to easily save, edit, retrieve and delete data from mongodb.
Install: npm install mongoose --save

mongodb
Data base motor. DB is called tele_data
Start: sudo service mongod start
