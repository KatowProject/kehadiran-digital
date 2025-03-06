const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

registerFont('assets/fonts/Madelyn.otf', { family: 'Madelyn' });
registerFont('assets/fonts/GladiolaRegular-Regular.ttf', { family: 'Gladiola' });

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

    const image = await loadImage('assets/template/sertifikat-peserta.png');
    const ttdKaprodi = await loadImage('assets/template/ttd-kaprodi.png');
    const ttdPemateri = await loadImage('assets/template/ttd-pemateri.png');
    const ttdRangga = await loadImage('assets/template/ttd-rangga.png');

    for (const attendance of attendances) {
        const canvas = createCanvas(image.width, image.height);

        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        ctx.drawImage(ttdKaprodi, 380, canvas.height - 400, 300, 300);
        ctx.drawImage(ttdPemateri, (canvas.width / 2) - 125, canvas.height - 420, 300, 300);
        ctx.drawImage(ttdRangga, canvas.width - 650, canvas.height - 420, 300, 300);

        if (attendance.peserta.nama.length > 25) {
            ctx.font = 'bold 100px Gladiola';
        } else if (attendance.peserta.nama.length > 20) { 
            ctx.font = 'bold 115px Gladiola';
        } else if (attendance.peserta.nama.length > 17) {
            ctx.font = 'bold 125px Gladiola';
        } else {
            ctx.font = 'bold 150px Gladiola';
        }

        ctx.fillStyle = '#404040';
        ctx.textAlign = 'center';

        // make text captilize (in this case all words is upper case)
        const name = attendance.peserta.nama.toUpperCase().split(' ').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
        ctx.fillText(name, canvas.width / 2 + 15, canvas.height / 2 - 20);

        ctx.font = 'bold 80px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        // ctx.fillText('Kato', (canvas.width / 2) / 2 + 200, canvas.height - 675);

        ctx.font = 'bold 80px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        // ctx.fillText('20 Januari 2025', (canvas.width * 0.75) - 175, canvas.height - 675);

        fs.writeFileSync(`assets/certificate/${attendance.peserta.nim}-${attendance.peserta.nama}.png`, canvas.toBuffer('image/png'));

        console.log(`Certificate generated for ${attendance.peserta.nama}`);
    }
};

generateCertificates();