// env variables
require('dotenv').config();

// MongoDB user
const User = require('../models/User');
const UserVertifycation = require('../models/UserVertifycation');

// Password handle
const bcrypt = require('bcrypt');

// Email handler
const nodemailer = require('nodemailer');

// Unique string
const { v4: uuidv4 } = require('uuid');

// Nodemailer stuff
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})

// Testing success
transporter.verify((error, sucess) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Ready for message!');
    }
})

const sendVertifycationEmail = ({ _id, email }, res) => {
    // url to be used in the email
    const currentUrl = 'http://localhost:3000/';
    const uniqueString = uuidv4() + _id;

    // Mail options
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Vertifycation email',
        html: `<p>Vertifycation your email to sign up and login</p>
                <p>This link <b>expires in a 30 minutes.</b></p>
                <p><a href=${currentUrl + "verify/" + _id + "/" + uniqueString}>here</a>
                to proceed </p>`
    };

    // Hash the uniqueString
    const saltRounds = 10;
    bcrypt.hash(uniqueString, saltRounds).then(data => {
        // set value in userVertifycation collection
        const newVertifycation = UserVertifycation({
            userId: _id,
            uniqueString: data,
            createAt: Date.now(),
            expiresAt: Date.now() + 1800000,
        })

        newVertifycation.save().then(() => {
            transporter.sendMail(mailOptions).then(() => {
                // Email sent and vertifycation record saved
                res.json({
                    status: "PENDING",
                    message: "Vertifycation email sent!"
                })
            }).catch(err => {
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "Vertifycation failed!"
                })
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Couldn't save vertifycation email data!"
            })
        })
    }).catch((err) => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "An error occurred while hashing email data!"
        })
    })
}

class UserController {
    verify(req, res) {
        let { userId, uniqueString } = req.params;
        console.log(userId);
        UserVertifycation.find({ userId })
            .then(data => {
                console.log(data);
                if (data.length) {
                    // User verifycation record exist so we process
                    const { expiresAt } = data[0];
                    const hashedUniqueString = data[0].uniqueString;
                    // Checking for expires uniqueString 
                    if (expiresAt < Date.now()) {
                        // Record has expired so we delete it 
                        UserVertifycation.deleteOne({ userId })
                            .then(() => {
                                User.deleteOne({ _id: userId })
                                    .then(() => {
                                        let message = 'Link has expired!';
                                        res.redirect(`/user/verified/error=true&message=${message}`);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        let message = 'Clearing user with expires unique string failed!';
                                        res.redirect(`/user/verified/error=true&message=${message}`);
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                                let message = 'An error occured while clearing expires user vertification record!';
                                res.redirect(`/user/verified/error=true&message=${message}`);
                            })
                    } else {
                        // Valid record exists so we validate the user string
                        // First compare the hashed unique string
                        bcrypt.hash(uniqueString, hashedUniqueString)
                            .then(data => {
                                if (data) {
                                    // UniqueString match
                                    User.updateOne({ _id: userId }, { verified: true })
                                        .then(() => {
                                            UserVertifycation.deleteOne({ userId })
                                                .then(() => {
                                                    res.send('ok');
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                    let message = 'An error occured while finalizing successful verification!';
                                                    res.redirect(`/user/verified/error=true&message=${message}`);
                                                })
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            let message = 'An error occured while updating account!';
                                            res.redirect(`/user/verified/error=true&message=${message}`);
                                        })
                                } else {
                                    // Existing record but incorrect verifycation detail passed
                                    let message = 'Invalid verification detail passed. Check your inbox!';
                                    res.redirect(`/user/verified/error=true&message=${message}`);
                                }
                            }).catch(err => {
                                let message = 'An error occured while comparing unique string!';
                                res.redirect(`/user/verified/error=true&message=${message}`);
                            })
                    }
                } else {
                    // User verifycation record doesn't exist
                    let message = 'Account record does not exist or has been verified already!';
                    res.redirect(`/user/verified/error=true&message=${message}`);
                }
            })
            .catch(err => {
                console.log(err);
                let message = 'An error occurred while checking for existing user verification record!';
                res.redirect(`/user/verified/error=true&message=${message}`);
            })
    }

    verified(req, res) {
        res.sendFile();
    }

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
                                        sendVertifycationEmail(data, res);
                                    })
                                    .catch(() => {
                                        res.json({
                                            status: "FAILED",
                                            message: "An error occurred while saving acount!"
                                        })
                                    })
                            })
                            .catch(() => {
                                res.json({
                                    status: "FAILED",
                                    message: "An error occurred while hashing password!"
                                })
                            })
                    }
                })
                .catch(() => {
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
                    if (data.length) {
                        if (!data[0].verified) {
                            res.json({
                                status: "FAILED",
                                message: "Email hasn't been verified yet. Check your inbox!"
                            })
                        } else {
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
                        }
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Account does not exist!"
                        })
                    }
                })
                .catch(() => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while checking for existing user!"
                    })
                })
        }
    }
}

module.exports = new UserController;