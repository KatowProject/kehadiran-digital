const router = require('express').Router();
const Controller = require('../controllers/api');

router.get('/', Controller.index);
router.get('/attends', Controller.listAttendances);
router.post('/attend', Controller.attendPeserta);


module.exports = router;