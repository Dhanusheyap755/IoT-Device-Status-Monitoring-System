const express = require('express');
const router = express.Router();
const { getAllAlerts, deleteAlert } = require('../controllers/alertController');

router.get('/', getAllAlerts);
router.delete('/:id', deleteAlert);

module.exports = router;
