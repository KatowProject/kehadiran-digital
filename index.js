require('dotenv').config();

const express = require('express');
const cors = require('cors');
const prepareUrls = require('local-ip-url/prepareUrls');
const ejsMate = require('ejs-mate');

const mainRoute = require('./routes/main');
const apiRoute = require('./routes/api');

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/', mainRoute);
app.use('/api', apiRoute);
app.use('*', (_, res) => res.status(404).send('Not Found'));


app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).send('Internal Server Error');
});

const isDevelopment = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 3000;

if (isDevelopment) {
    const urls = prepareUrls({
        protocol: 'http',
        host: '0.0.0.0',
        port: PORT,
    });

    app.listen(PORT, () => console.log(`🚀 Server is running on\nLocal: ${urls.localUrl}\nNetwork: ${urls.lanUrl}`));
} else {
    app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
}
