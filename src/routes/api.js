const router = require('express').Router();
const Controller = require('../controllers/api');

router.get('/', Controller.index);


module.exports = router;