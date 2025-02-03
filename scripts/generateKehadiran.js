const fs = require('fs');
const chalk = require('chalk');
const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const templatePath = 'assets/template/template-kehadiran.xlsx';
const outputPath = 'assets/data/export-kehadiran.xlsx';
const CELL = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];

const paginateData = (data, page) => {
    const start = page * 42;
    const end = start + 42;
    return data.slice(start, end);
};

const fetchAttendances = async () => {
    return await prisma.peserta.findMany({
        select: {
            nama: true,
            nim: true,
            kelas: true,
            no_handphone: true,
            Kehadiran: {
                select: {
                    hadir: true,
                }
            }
        },
    });
};

const updateWorksheet = (worksheet, data, cellIndex) => {
    let start = 6;
    for (const attendance of data) {
        worksheet.getCell(`${CELL[cellIndex]}${start}`).value = attendance.nama;
        worksheet.getCell(`${CELL[cellIndex + 1]}${start}`).value = attendance.nim;
        worksheet.getCell(`${CELL[cellIndex + 2]}${start}`).value = attendance.kelas;
        worksheet.getCell(`${CELL[cellIndex + 3]}${start}`).value = attendance.no_handphone;
        worksheet.getCell(`${CELL[cellIndex + 4]}${start}`).value = attendance.Kehadiran[0]?.hadir ? '✔️' : '❌';
        start++;
    }
};

const exportData = async () => {
    const attendances = await fetchAttendances();

    if (!attendances || attendances.length === 0) {
        console.log(chalk.red('Data not found'));
        return;
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1);

    const totalPage = Math.ceil(attendances.length / 42);
    let cellIndex = 0;

    for (let i = 0; i < totalPage; i++) {
        const data = paginateData(attendances, i);
        updateWorksheet(worksheet, data, cellIndex);
        cellIndex += 6;
    }

    await workbook.xlsx.writeFile(outputPath);
    console.log(chalk.green(`Data exported to ${outputPath}`));
};

exportData();