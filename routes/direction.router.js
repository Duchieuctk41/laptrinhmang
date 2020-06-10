const router = require('express').Router();
var handle = require('../controllers/handle')
router.get('/', handle.getIndex);
router.post('/login', handle.postLogin);
module.exports = router;