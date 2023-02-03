// env variables
require('dotenv').config();

// MongoDB user
const User = require('../models/User');

// Password handle
const bcrypt = require('bcrypt');

class UserController {

    signup(req, res) {
        let { name, email, password } = req.body;
        name = name.trim();
        email = email.trim();
        password = password.trim();

        if (name == "" || email == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Empty input!"
            })
        } else {
            User.find({ email })
                .then(data => {
                    if (data.length) {
                        res.json({
                            status: "FAILED",
                            message: "Email already exists!"
                        })
                    } else {
                        const saltRounds = 10;
                        bcrypt.hash(password, saltRounds)
                            .then(data => {
                                const newUser = new User({
                                    name,
                                    email,
                                    password: data,
                                    verified: false,
                                });
                                newUser.save()
                                    .then(data => {
                                        res.json({
                                            status: "SUCCESS",
                                            message: "Sign up successful!"
                                        })
                                    })
                                    .catch(err => {
                                        res.json({
                                            status: "FAILED",
                                            message: "An error occurred while saving acount!"
                                        })
                                    })
                            })
                            .catch(err => {
                                res.json({
                                    status: "FAILED",
                                    message: "An error occurred while hashing password!"
                                })
                            })
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while checking for acount!"
                    })
                })
        }
    }

    // Login
    login(req, res) {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (email == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Empty input!"
            })
        } else {
            User.find({ email })
                .then(data => {
                    if (data) {
                        const hashedPassword = data[0].password;
                        bcrypt.compare(password, hashedPassword)
                            .then(data => {
                                if (data) {
                                    res.json({
                                        status: "SUCCESS",
                                        message: "Login successful!",
                                        data: data
                                    })
                                } else {
                                    res.json({
                                        status: "FAILED",
                                        message: "Incorrect password!"
                                    })
                                }
                            })
                            .catch(err => {
                                res.json({
                                    status: "FAILED",
                                    message: "An error occurred while comparing password!"
                                })
                            })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Account does not exist!"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while checking for existing user!"
                    })
                })
        }
    }

}

module.exports = new UserController;