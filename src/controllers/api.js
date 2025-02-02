const Express = require('express');

const { getUserById } = require('../models/peserta');
const { createAttendance, getAttendanceByUserId, getAllAttendances } = require('../models/kehadiran');

const { decryptData } = require('../utils/crypto');
const { dateISO } = require('../utils/date');

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

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next 
 */
const listAttendances = async (req, res, next) => {
    try {
        const attendances = await getAllAttendances({ type: 'desc', field: 'created_at' });
        return res.status(200).json({
            success: true,
            data: attendances
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}
/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next 
 */
const attendPeserta = async (req, res, next) => {
    try {
        const { data } = req.body;

        if (!data) return res.status(400).json({
            success: false,
            message: 'Data is required'
        });

        const decryptedData = decryptData(data);
        const { id } = JSON.parse(decryptedData);

        const user = await getUserById(id);
        if (!user) return res.status(404).json({
            success: false,
            message: 'User not found'
        });

        const attendance = await getAttendanceByUserId(id);
        if (attendance.length > 0) return res.status(400).json({
            success: false,
            message: 'User already attended'
        });

        await createAttendance({
            peserta_id: id,
            hadir: true,
            created_at: dateISO('id')
        });

        return res.status(200).json({
            success: true,
            message: 'Attendance created'
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
    index,
    listAttendances,
    attendPeserta
}