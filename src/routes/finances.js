const express = require('express');
const router = express.Router();

const debtorController = require('../app/controller/DebtorController');
const debtController = require('../app/controller/DebtController');
const trashController = require('../app/controller/TrashController');

router.post('/createNewDebtor', debtorController.addNew);
router.post('/updateDebtor', debtorController.update);
router.post('/searchDebt', debtController.search);
router.post('/addNewDebt', debtController.addNew);
router.get('/detail/:slug', debtController.show);
router.get('/trash', trashController.show);
router.get('/debt/delete/:id', debtController.delete);
router.get('/debt/restore/:id', debtController.restore);
router.get('/', debtorController.show);

module.exports = router;