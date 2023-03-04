const express = require('express');
const router = express.Router();

const debtorController = require('../app/controller/DebtorController');
const debtController = require('../app/controller/DebtController');
const trashController = require('../app/controller/TrashController');

router.post('/createNewDebtor', debtorController.addNew);
router.post('/updateDebtor', debtorController.update);
router.post('/addNewDebt', debtController.addNew);
router.get('/detail/debt/:slug', debtController.showDebts);
router.get('/detail/:slug', debtController.show);
router.get('/debtors', debtorController.showDebtors);
router.get('/trash', trashController.show);
router.get('/:slug', debtController.getDebtor);
router.post('/debt/delete', debtController.delete);
router.get('/debt/restore/:id', debtController.restore);
router.get('/', debtorController.show);

module.exports = router;