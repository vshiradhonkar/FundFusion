const express = require('express');
const router = express.Router();

const { listDeals, getDealsForStartup } = require('../controllers/dealController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, listDeals);
router.get('/startup/:startupId', authMiddleware, getDealsForStartup);

module.exports = router;
