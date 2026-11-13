const express = require('express');
const router = express.Router();
const {
  getReadingsByDeviceId,
  getAllRecentReadings,
} = require('../controllers/readingController');

router.get('/', getAllRecentReadings);
router.get('/:id', getReadingsByDeviceId);

module.exports = router;
