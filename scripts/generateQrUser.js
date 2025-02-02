const fs = require('fs');
const QrCode = require('qrcode');
const { PrismaClient } = require('@prisma/client');

const { encryptData } = require('../src/utils/crypto');

const prisma = new PrismaClient();

const generateQrUser = async () => { 
    const users = await prisma.peserta.findMany();

    for (const user of users) {
        const data = JSON.stringify({
            id: user.id,
            nama: user.nama
        });
        const encryptedData = encryptData(data);

        const qr = await QrCode.toDataURL(encryptedData, {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            quality: 1,
            margin: 1,
            width: 500
        });

        const path = `assets/qr/${user.id}.jpeg`;
        fs.writeFileSync(path, qr.split(';base64,').pop(), { encoding: 'base64' });

        console.log(`QR Code for ${user.nama} has been generated!`);
    }
}

generateQrUser().finally(() => {
    prisma.$disconnect();
});