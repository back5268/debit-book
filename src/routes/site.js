const express = require('express');
const router = express.Router();

const siteController = require('../app/controller/SiteController');
const captchaController = require('../app/controller/CaptchaController');
const passwordResetController = require('../app/controller/PasswordResetController');
const verificationController = require('../app/controller/VerificationController');
const loginController = require('../app/controller/LoginController');
const signupController = require('../app/controller/SignupController');
const profileController = require('../app/controller/ProfileController');
const systemController = require('../app/controller/SystemController');

// Login
router.post('/login', loginController.loginPost);
router.get('/login', loginController.loginGet);
router.get('/logout', loginController.logout);

// Signup verification
router.post('/signup', signupController.signupPost);
router.get('/signup', signupController.signupGet);
router.get('/verify/:userId/:uniqueString', verificationController.verify);

// PasswordReset
router.post('/passwordrr', passwordResetController.passwordrr);
router.get('/passwordrr', passwordResetController.getRequest);
router.post('/resetPassword', passwordResetController.resetPassword);
router.get('/resetPassword/:userId/:resetString/:email/:account', passwordResetController.getReset);

// Captcha
router.get('/captcha', captchaController.captcha);
router.get('/newCaptcha', captchaController.newCaptcha);

// profile
router.get('/profile', profileController.show);
router.post('/updateUserInfo', profileController.updateUserInfo);
router.post('/updateUserAccount', profileController.updateUserAccount);

// control
router.get('/control/show', systemController.show);
router.get('/control', systemController.render);

router.get('/', siteController.index);

module.exports = router;