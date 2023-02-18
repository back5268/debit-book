const express = require('express');
const router = express.Router();

const financesController = require('../app/controller/FinancesController');

router.post('/createNewDebtor', financesController.createNewDebtor);
router.post('/addNewDebt', financesController.addNewDebt);
router.get('/detail/:slug', financesController.showDetail);
router.get('/', financesController.show);

module.exports = router;