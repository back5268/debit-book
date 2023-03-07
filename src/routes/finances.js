const express = require('express');
const router = express.Router();

const debtorController = require('../app/controller/DebtorController');
const debtController = require('../app/controller/DebtController');
const trashController = require('../app/controller/TrashController');

router.post('/trash/restore', trashController.restore);
router.get('/trash/:slug', trashController.show);
router.get('/trash', trashController.render);

router.post('/debt/delete', debtController.delete);
router.post('/debt/add', debtController.add);
router.get('/debt/show/:slug', debtController.show);
router.get('/debt/:slug', debtController.render);

router.post('/debtor/update', debtorController.update);
router.post('/debtor/add', debtorController.add);
router.get('/debtor/show', debtorController.show);
router.get('/debtor/:slug', debtorController.info);
router.get('/debtor', debtorController.render);

module.exports = router;