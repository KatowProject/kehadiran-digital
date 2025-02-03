const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const chalk = require('chalk');
const { Parser } = require('json2csv');

const prisma = new PrismaClient();

const exportData = async (table, type) => {
    let data = [];

    try {
        if (table === 'kehadiran') {
            data = await prisma.kehadiran.findMany({
                include: {
                    peserta: {
                        select: {
                            nim: true,
                            nama: true,
                            email: true,
                            no_handphone: true
                        }
                    }
                }
            });
        } else if (table === 'peserta') {
            data = await prisma.peserta.findMany();
        } else {
            console.log(chalk.red('Table not found'));
            return;
        }

        if (!data || data.length === 0) {
            console.log(chalk.red('Data not found'));
            return;
        }

        const filename = `assets/data/export-${table}-${Date.now()}${type === 'csv' ? '.csv' : '.json'}`;
        if (type === 'csv') {
            const fields = table === 'kehadiran' 
                ? ['id', 'peserta_id', 'hadir', 'created_at', 'updated_at', 'nim', 'nama', 'email', 'no_handphone']
                : Object.keys(data[0]);
            const opts = { fields };
            const parser = new Parser(opts);

            const csv = parser.parse(data.map(row => ({
                ...row,
                nim: row.peserta?.nim,
                nama: row.peserta?.nama,
                email: row.peserta?.email,
                no_handphone: row.peserta?.no_handphone
            })));

            fs.writeFileSync(filename, csv);
            console.log(chalk.green(`Data exported to ${filename} with CSV format`));
        } else {
            fs.writeFileSync(filename, JSON.stringify(data, null, 2));
            console.log(chalk.green(`Data exported to ${filename} with JSON format`));
        }
    } catch (error) {
        console.error(chalk.red('Error exporting data:', error));
    } finally {
        await prisma.$disconnect();
    }
};

const args = process.argv.slice(2);
const tableArg = args.find(arg => arg.startsWith('--table='));
const typeArg = args.find(arg => arg.startsWith('--type='));

if (!tableArg || !typeArg) {
    console.error(chalk.red('Please provide --table and --type argument'));
    console.error(chalk.yellow('Description:'));
    console.error(chalk.yellow('Export data from a table database to a file\n'));
    console.error(chalk.yellow('Example:'));
    console.error(chalk.yellow('npm run export -- --table=kehadiran --type=csv'));
    process.exit(1);
}

const table = tableArg.split('=')[1];
const type = typeArg.split('=')[1];

exportData(table, type);