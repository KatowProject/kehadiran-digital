const Express = require('express');

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next 
 */
const Home = async (req, res, next) => {
    return res.render('main/home', { title: 'Home | Sistem Kehadiran Seminar' });
}

module.exports = {
    Home
}