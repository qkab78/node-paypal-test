const express = require('express');
const router = express.Router();
const Index = require('../controllers/index-controller');

router.get('/', Index.getIndex);
router.post('/pay', Index.pay);
router.get('/success', Index.resSuccess);
router.get('/cancel', Index.resCancel);

module.exports = router;