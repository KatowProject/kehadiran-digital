const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.peserta.create({
        data: {
            nama: 'John Doe',
            nim: '123456789',
            kelas: 'A',
            no_handphone: '08123456789',
            email: 'sigma@mail.com',
        }
    })

    console.log('Seeding success');
}

main();