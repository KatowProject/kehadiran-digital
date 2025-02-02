const router = require('express').Router();
const Controller = require('../controllers/api');

router.get('/', Controller.index);
router.post('/attend', Controller.attendPeserta);


module.exports = router;