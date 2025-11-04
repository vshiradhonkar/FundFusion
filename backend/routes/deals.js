const express = require('express');
const router = express.Router();

const { listDeals } = require('../controllers/dealController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, listDeals);

module.exports = router;
