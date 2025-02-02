const crypto = require('crypto');

const encryptData = (data) => {
    const key = crypto.createHash('sha256').update(String(process.env.QR_SECRET)).digest('base64').substr(0, 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return iv.toString('base64') + ':' + encrypted;
};

const decryptData = (data) => {
    const key = crypto.createHash('sha256').update(String(process.env.QR_SECRET)).digest('base64').substr(0, 32);
    const [iv, encrypted] = data.split(':').map(v => Buffer.from(v, 'base64'));

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {
    encryptData,
    decryptData
};