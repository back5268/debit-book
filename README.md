# Debit Book NodeJS Project
## Project Overview
This debit book project is a web application that allows users to keep track of their debits with their partners, and users can also add and view details of events in the calendar. The application has been built using Node.js as a server-side programming language and Mongoose ORM to connect and interact with the MongoDB database. Express.js is used as a web application framework to handle HTTP requests, responses, and routing. HTML, CSS, and JavaScript were used to create the user interface and handle user interactions.

## Dependencies
The project uses the following dependencies:
- **`Express:`** A web application framework for Node.js
- **`Mongoose:`** An ORM for MongoDB
- **`Mongoose-slug-generator:`** A plugin for Mongoose that generates slugs for documents
- **`Express-session:`** A middleware for session management in Node.js
- **`Cookie-parser:`** A middleware for handling cookies in Express.
- **`Express-handlebars:`** A templating engine for Node.js
- **`Bcrypt:`** A library for hashing passwords in Node.js
- **`Bootstrap:`** A popular front-end framework for building responsive websites
- **`Jquery:`** A JavaScript library that simplifies HTML document traversal and manipulation, as well as event handling and Ajax
- **`Popper.js:`** A library for positioning popovers and tooltips
- **`Dotenv:`** A zero-dependency module that loads environment variables from a .env file into process.env
- **`Svg-captcha:`** A library for generating SVG-based CAPTCHAs
- **`Nodemailer:`** A library for sending emails.
- **`Uuid:`** A library for generating unique identifiers (UUIDs)

## Project Structure
The project is structured as follows:
- **server.js:** The main application file
- **config:** Directory containing configuration files for the application
- **controllers:** Directory containing controller functions for the application
- **models:** Directory containing Mongoose schema definitions for the application
- **public:** Directory containing static assets (CSS, JavaScript, images)
- **routes:** Directory containing route definitions for the application
- **views:** Directory containing Handbars templates for the application
- **util:** Directory containing application utilities

## Functionality
The Debit Book application provides the following functionality:
- Register by gmail (email queue)
- User authentication (login, logout)
- Forgot password by gmail (email queue)
- Debtor (show, show detail, add, update, filter, sort, paginitation)
- Debt (show, show detail, add, delete, restore, filter, sort, paginitation)
- Event (add, show detail, view by week, view by month)


## Usages
1. Clone the project repository
2. Navigate to the project directory in your terminal/command prompt
3. Create a new file **`.env`** in the root directory of your project and add your sensitive information to the file
```
MONGODB_URI=[]

AUTH_EMAIL=[your email]
AUTH_PASS=[your password]

CURRENT_URL=http://localhost:3000/
```
4. Install the project dependencies by running npm install
5. Start the project by running npm start
