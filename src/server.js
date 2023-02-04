require('./config/db');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const route = require('./routes')
const app = express();
const port = process.env.port || 3000;

const session = require("express-session");
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: true }));

// body parser 
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// image, static public
app.use(express.static(path.join(__dirname, 'public')));

//HTTP logger
app.use(morgan('combined'));

//Template engine
app.engine('hbs', engine({
    extname: ".hbs"
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});