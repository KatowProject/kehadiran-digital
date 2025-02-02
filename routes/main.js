const router = require('express').Router();
const Controller = require('../controllers/main');

router.get('/', Controller.Home);

module.exports = router;