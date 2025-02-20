const { PrismaClient } = require('@prisma/client');
const EventEmitter = require('events');

const prisma = new PrismaClient();
const model = prisma.kehadiran;

class AttendanceEmitter extends EventEmitter {}
const attendanceEmitter = new AttendanceEmitter();

/**
 * Validates the sort object
 * @param {{type: string, field: string}} sort
 */
const validateSort = (sort) => {
    if (typeof sort !== 'object') 
        throw new Error('Sort must be an object');
    
    const { type, field } = sort;

    if (!type || !field)
        throw new Error('Sort must have type and field properties');

    if (type !== 'asc' && type !== 'desc')
        throw new Error('Sort type must be asc or desc');

    if (typeof field !== 'string')
        throw new Error('Sort field must be a string');

    if (!Object.keys(model.fields).includes(field))
        throw new Error('Sort field not found in model');
};

module.exports = {
    model,
    attendanceEmitter,

    /**
     * Get all attendances with sorting and limit
     * @param {{type: string, field: string}} sort
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    getAllAttendances: async (sort = { type: 'asc', field: 'id' }, limit) => {
        validateSort(sort);

        return await model.findMany({
            orderBy: {
                [sort.field]: sort.type
            },
            take: limit,
            include: {
                peserta: {
                    select: {
                        nama: true,
                        nim: true
                    }
                }
            }
        });
    },

    /**
     * Get attendance by ID
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    getAttendanceById: async (id) => {
        return await model.findUnique({
            where: { id }
        });
    },

    /**
     * Get attendances by user ID
     * @param {number} id
     * @returns {Promise<Array>}
     */
    getAttendanceByUserId: async (id) => {
        return await model.findMany({
            where: { peserta_id: id }
        });
    },

    /**
     * Create a new attendance
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    createAttendance: async (data) => {
        const attendance = await model.create({
            data,
            include: {
                peserta: {
                    select: {
                        nama: true,
                        nim: true
                    }
                }
            }   
        });

        attendanceEmitter.emit('newAttendance', attendance);

        return attendance;
    },

    /**
     * Update an attendance by ID
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    updateAttendance: async (id, data) => {
        const attendance = await model.update({
            where: { id },
            data,
            include: {
                peserta: {
                    select: {
                        nama: true,
                        nim: true
                    }
                }
            }
        });;

        attendanceEmitter.emit('updateAttendance', attendance);

      return attendance;
    },

    /**
     * Delete an attendance by ID
     * @param {number} id
     * @returns {Promise<Object>}
     */
    deleteAttendance: async (id) => {
        return await model.delete({
            where: { id }
        });
    }
};