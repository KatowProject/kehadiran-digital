const Express = require('express');

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next
 */
const index = async (req, res, next) => {
    try {
        return res.json({
            success: true,
            message: 'Welcome to the API'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

module.exports = {
    index
}