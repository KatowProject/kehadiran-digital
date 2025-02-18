const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const model = prisma.peserta;

module.exports = {
    model,
    getAllUsers: async () => {
        return await model.findMany();
    },
    getUserById: async (id) => {
        return await model.findUnique({
            where: { id }
        });
    },
    createUser: async (data) => {
        return await model.create({
            data
        });
    },
    updateUser: async (id, data) => {
        return await model.update({
            where: { id },
            data
        });
    },
    deleteUser: async (id) => {
        return await model.delete({
            where: { id }
        });
    }
}



