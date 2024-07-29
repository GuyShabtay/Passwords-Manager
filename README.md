# Passwords Manager
<p>Secure password manager that stores user passwords in an encrypted 
format and allows users to retrieve and manage their passwords.</p>

## How to run this project

- Add to the backend folder a file called ```.env``` and in that file add these variables: 
 ```bash
TOKEN_KEY='your token key'
MONGODB_URL='your MongoDB url'
AES_KEY='your AES key'
  ```

- Install dependecies:
<pre><code>npm run install:all</code></pre>

- Start the application:
<pre><code>npm start</code></pre>

- In order to run the tests, while the application is running open a new terminal and write:
<pre><code>npm test</code></pre>

## Technologies
- HTML
- CSS
- JavaScript
- React
- Axios
- Selenium
- Mui
- Node.js
- Express
- MongoDB
- Bcrypt
- Cors
- Dotnev
- Jsonwebtoken
- AES

## Features
- Register
- Login
- Add new credentials (website name and pssword)
- Search for a password by website name
- Add, view, edit and delete credentials related to a user
- Logout

## Tests
- Register
- Login
- Add new credentials (website name and pssword)
- Search for a password by website name
- Add credentials related to a user
- Logout