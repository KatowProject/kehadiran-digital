require('dotenv').config();

const express = require('express');
const cors = require('cors');
const prepareUrls = require('local-ip-url/prepareUrls');
const ejsMate = require('ejs-mate');
const path = require('path');
const chalk = require('chalk');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

const mainRoute = require('./routes/main');
const apiRoute = require('./routes/api');
const socketHandler = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); 

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

app.use('/', mainRoute);
app.use('/api', apiRoute);

app.use('*', (_, res) => res.status(404).json({
    success: false,
    message: 'Not Found'
}));

app.use((err, req, res, next) => {
    console.error(chalk.red(err.stack));
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

socketHandler(io);

const isDevelopment = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 3000;

if (isDevelopment) {
    const urls = prepareUrls({
        protocol: 'http',
        host: '0.0.0.0',
        port: PORT,
    });

    console.log(chalk.bgGreen(`🚀 Server is running in Development Mode`));
    console.log(chalk.cyan(`Local: ${urls.localUrl}`));
    console.log(chalk.cyan(`Network: ${urls.lanUrl}`));

    server.listen(PORT, '0.0.0.0');
} else {
    console.log(chalk.bgYellow(`🚀 Server is running in Production Mode`));
    console.log(chalk.cyan(`Local: http://localhost:${PORT}`));
    console.log(chalk.cyan(`Network: [Not Available]`));

    server.listen(PORT);
}