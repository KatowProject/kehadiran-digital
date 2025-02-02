const csv = require('csv-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const importUsers = async () => {
    // check in folder assets/temp
    const folderPath = path.join(__dirname, '../assets/temp');

    // check users.csv or users.xlsx
    const files = fs.readdirSync(filePath);
    const file = files.find(file => file.includes('users'));
    const fileExtension = path.extname(file);
    const filePath = path.join(folderPath, file);

    if (!file) throw new Error('File not found, file must be named users.csv or users.xlsx');

    const users = [];

    if (fileExtension === '.csv') {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                for (const result of results) {
                    users.push({
                        nim: result.nim,
                        nama: result.nama,
                        kelas: result.kelas
                    });
                }

                await prisma.peserta.createMany({
                    data: users
                });

                console.log('Import users success');
            });
    } else if (fileExtension === '.xlsx') {
        const workbook = xlsx.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        for (const data of xlData) {
            users.push({
                nim: data.nim,
                nama: data.nama,
                kelas: data.kelas
            });
        }

        await prisma.peserta.createMany({
            data: users
        });

        console.log('Import users success');
    } else {
        console.log('File type not supported');
    }

    fs.unlinkSync(filePath);
}

