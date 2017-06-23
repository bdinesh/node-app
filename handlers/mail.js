const nodemailer = require('nodemailer');
const pug = require('pug');
// makes the external css styles of html tags as inline styles 
const juice = require('juice');
const promisify = require('es6-promisify');
// converts the html to text
const htmlToText = require('html-to-text');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const generateHtml = (filename, options) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    const inlined = juice(html);

    return inlined;
};

exports.send = async (options) => {
    const html = generateHtml(options.filename, options);
    const text = htmlToText.fromString(html);
    const mailOptions = {
        from: 'noreply@thatsdelicious.com',
        to: options.user.email,
        subject: options.subject,
        html,
        text
    };

    const sendMail = promisify(transport.sendMail, transport);

    return sendMail(mailOptions);
};