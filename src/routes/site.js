const express = require('express');
const router = express.Router();
const siteController = require('../app/controller/SiteController');
const userController = require('../app/controller/UserController');

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get('/login', siteController.login);
router.get('/signup', siteController.signup);
router.get('/', siteController.index);

module.exports = router;