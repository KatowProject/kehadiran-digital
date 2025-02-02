const { getAllAttendances, attendanceEmitter } = require('../models/kehadiran');

/**
 * Sends the initial list of attendances to the connected client
 * @param {Socket} socket
 */
const sendInitialAttendances = async (socket) => {
    try {
        const attendances = await getAllAttendances({ type: 'desc', field: 'created_at' });
        socket.emit('initialAttendances', attendances);
    } catch (error) {
        console.error('Error sending initial attendances:', error);
    }
};

/**
 * Sends new attendance to the connected client
 * @param {Socket} socket
 * @param {Object} attendance
 */
const sendNewAttendances = (socket, attendance) => {
    socket.emit('newAttendance', attendance);
};

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        sendInitialAttendances(socket);

        const handleNewAttendance = (attendance) => sendNewAttendances(socket, attendance);
        attendanceEmitter.on('newAttendance', handleNewAttendance);

        socket.on('disconnect', () => {
            console.log('Client disconnected');
            attendanceEmitter.off('newAttendance', handleNewAttendance);
        });
    });
};

module.exports = socketHandler;