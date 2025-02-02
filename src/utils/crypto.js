const crypto = require('crypto');

const encryptData = (data) => {
    const key = crypto.createHash('sha256').update(String(process.env.QR_SECRET)).digest('base64').substr(0, 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
};

const decryptData = (data) => {
    const key = crypto.createHash('sha256').update(String(process.env.QR_SECRET)).digest('base64').substr(0, 32);
    const [iv, encrypted] = data.split(':').map(v => Buffer.from(v, 'hex'));

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {
    encryptData,
    decryptData
};