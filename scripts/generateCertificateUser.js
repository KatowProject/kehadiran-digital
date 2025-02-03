const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateCertificates = async () => {
    const attendances = await prisma.kehadiran.findMany({
        include: {
            peserta: {
                select: {
                    nama: true,
                    nim: true
                }
            }
        }
    });

    const image = await loadImage('assets/template/certificate.jpeg');

    for (const attendance of attendances) {
        const canvas = createCanvas(image.width, image.height);

        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 150px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(attendance.peserta.nama, canvas.width / 2, canvas.height / 2 - 25);

        ctx.font = 'bold 80px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText('Kato', (canvas.width / 2) / 2 + 200, canvas.height - 675);

        ctx.font = 'bold 80px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText('20 Januari 2025', (canvas.width * 0.75) - 175, canvas.height - 675);

        fs.writeFileSync(`assets/certificate/${attendance.peserta.nim}.png`, canvas.toBuffer('image/png'));

        console.log(`Certificate generated for ${attendance.peserta.nama}`);
    }
};

generateCertificates();