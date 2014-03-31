var nodemailer = require('nodemailer'),
config = require('../../config/config');

exports.smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: config.mail.user,
    pass: config.mail.password
  }
});
