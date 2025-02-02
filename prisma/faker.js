const { PrismaClient } = require('@prisma/client');
const { Faker, id_ID } = require('@faker-js/faker');

const prisma = new PrismaClient();
const faker = new Faker({ locale: [id_ID] });

async function main() {
    const arr = Array.from({ length: 100 }, () => ({ 
        nama: faker.person.fullName(),
        nim: faker.number.int(100000000, 999999999).toString(),
        kelas: faker.helpers.arrayElement(['A', 'B', 'C', 'D']),
        no_handphone: faker.phone.number({ style: 'international'}),
        email: faker.internet.email(),
    }));

    await prisma.peserta.createMany({
        data: arr
    });
    
    console.log('Dummy data seeding success');
}

main();