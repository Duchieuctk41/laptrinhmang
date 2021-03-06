const router = require('express').Router();
var handle = require('../controllers/handle')
router.get('/', handle.getIndex);
router.get('/message', handle.isLogined_next, handle.getLogin);
router.post('/logout', handle.isLogined_next, handle.Logout);
// router.post('/insertUser', handle.isLogined_next);
router.post('/login', handle.postLogin);
module.exports = router;