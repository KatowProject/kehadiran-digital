const crypto = require('crypto');
const fs = require('fs');
const QrCode = require('qrcode');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generateQrUser = async () => { 
    const users = await prisma.peserta.findMany();

    for (const user of users) {
        // encrypt the data user for security
        const data = JSON.stringify(user);

        const key = crypto.createHash('sha256').update(String(process.env.QR_SECRET)).digest('base64').substr(0, 32);
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const encryptedData = iv.toString('hex') + ':' + encrypted;

        const qr = await QrCode.toDataURL(encryptedData, {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            quality: 1,
            margin: 1,
            width: 500
        });

        // save to assets/qr
        const path = `assets/qr/${user.id}.jpeg`;
        fs.writeFileSync(path, qr.split(';base64,').pop(), { encoding: 'base64' });

        console.log(`QR Code for ${user.nama} has been generated!`);
    }
}

generateQrUser().finally(() => {
    prisma.$disconnect();
});