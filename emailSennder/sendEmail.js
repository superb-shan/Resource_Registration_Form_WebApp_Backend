
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');

const smtpConfig = {
    host: 'smtp.gmail.com', // Replace with the correct SMTP server address for your email provider
    port: 587, // SMTP port for Gmail
    secure: false, // Set to true if your provider requires SSL/TLS
    auth: {
        user: 'ragunanthan8888@gmail.com',
        pass: 'exbhyapjoeqedvco',
    },
};

const transporter = nodemailer.createTransport(smtpConfig);


async function sendEmail(emailData, template) {


    try {
        let emailTemplatePath;
        if (template == 'accepted') {
            emailTemplatePath = '../emailSender/templates/accept.ejs'
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

sendEmail('John Doe', 'Resource XYZ', 'IT Department', 'Resource', 'ragunanthan8888@gmail.com');


module.exports = sendEmail