const { createCanvas, loadImage} = require('canvas');
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


};

generateCertificates();