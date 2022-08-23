var nodemailer = require("nodemailer");


let mailTrasporter = nodemailer.createTransport({
    pool: true,
    service: "gmail",
    host: 'smtp.gmail.com',
    // port: 465,
    port: 587,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "infoyadav95@gmail.com",
        pass: "ulnklssaexjtloyd"
    }
});

module.exports = mailTrasporter;