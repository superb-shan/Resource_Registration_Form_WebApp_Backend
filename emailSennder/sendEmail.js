const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');

// const smtpConfig = {
//     host: 'smtp.gmail.com', // Replace with the correct SMTP server address for your email provider
//     port: 587, // SMTP port for Gmail
//     secure: false, // Set to true if your provider requires SSL/TLS
//     auth: {
//         user: 'ragunanthan8888@gmail.com',
//         pass: 'exbhyapjoeqedvco',
//     },
// };
const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465, // Use port 465 for SSL/TLS
    secure: true, // Use SSL/TLS
    auth: {
        user: 'ragunanthan8888@gmail.com',
        pass: 'exbhyapjoeqedvco', // Generated App Password
    },
};


const transporter = nodemailer.createTransport(smtpConfig);


async function sendEmail(emailData, template) {


    try {
        let emailTemplatePath;
        if (template == 'accepted') {
            emailTemplatePath = path.join(__dirname, 'templates','accepted.ejs')
        }
        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');
        const renderedEmail = ejs.render(emailTemplate, emailData);

        const mailOptions = {
            from: 'ragunanthan8888@gmail.com',
            to: emailData.sendEmail,
            subject: 'Request Approved',
            html: renderedEmail,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
const myPath = path.join(__dirname);
module.exports = sendEmail