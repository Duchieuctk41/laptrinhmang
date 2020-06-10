const router = require('express').Router();
var handle = require('../controllers/handle')
router.get('/', handle.getIndex);
router.get('/message', handle.isLogined_next, handle.getLogin);
router.post('/login', handle.postLogin);
module.exports = router;