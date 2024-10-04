const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

// Setup Nodemailer with Mailgun
const transporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: 'your-mailgun-api-key', // Replace with your Mailgun API key
      domain: 'your-mailgun-domain',    // Replace with your Mailgun domain
    },
  })
);

// Send email function
const sendEmail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: 'your-email@example.com', // Sender’s email
    to: to, // Recipient’s email
    subject: subject,
    html: htmlContent, // HTML content of the email
  };

  // Sending the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error occurred: ', err);
    } else {
      console.log('Email sent: ', info.messageId);
    }
  });
};

module.exports = sendEmail;
