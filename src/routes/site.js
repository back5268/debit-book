const express = require('express');
const router = express.Router();
const siteController = require('../app/controller/SiteController');
const userController = require('../app/controller/UserController');
const captchaController = require('../app/controller/CaptchaController');

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/passwordResetRequest', userController.passwordResetRequest);
router.post('/resetPassword', userController.resetPassword);

router.get('/captcha', captchaController.captcha);
router.get('/newCaptcha', captchaController.newCaptcha);

router.get('/verify/:userId/:uniqueString', userController.verify);
router.get('/verified', userController.verified);
router.get('/login', siteController.login);
router.get('/signup', siteController.signup);
router.get('/', siteController.index);

module.exports = router;