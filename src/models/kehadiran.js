const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const model = prisma.kehadiran;

module.exports = {
    model,
    getAllAttendances: async () => {
        return await model.findMany();
    },
    getAttendanceById: async (id) => {
        return await model.findUnique({
            where: { id }
        });
    },
    getAttendanceByUserId: async (id) => {
        return await model.findMany({
            where: { peserta_id: id }
        });
    },
    createAttendance: async (data) => {
        return await model.create({
            data
        });
    },
    updateAttendance: async (id, data) => {
        return await model.update({
            where: { id },
            data
        });
    },
    deleteAttendance: async (id) => {
        return await model.delete({
            where: { id }
        });
    }
}