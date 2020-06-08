const router = require('express').Router();
var handle = require('../controllers/handle')
router.get('/', handle.getIndex);
module.exports = router;