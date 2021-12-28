const nodemailer = require('nodemailer');
const sendMailPDF = async (email,subject, html) => {
  try {
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        // type: 'OAuth2',
        user:
          process.env.ENVIROMENT === 'PRODUCTION'
            ? process.env.PRODUCTION_MAIL_USERNAME
            : process.env.MAIL_USERNAME,
        pass:
          process.env.ENVIROMENT === 'PRODUCTION'
            ? process.env.PRODUCTION_MAIL_PASSWORD
            : process.env.MAIL_PASSWORD,
        clientId:
          process.env.ENVIROMENT === 'PRODUCTION'
            ? process.env.PRODUCTION_OAUTH_CLIENTID
            : process.env.OAUTH_CLIENTID,
        clientSecret:
          process.env.ENVIROMENT === 'PRODUCTION'
            ? process.env.PRODUCTION_OAUTH_CLIENT_SECRET
            : process.env.OAUTH_CLIENT_SECRET,
        refreshToken:
          process.env.ENVIROMENT === 'PRODUCTION'
            ? process.env.PRODUCTION_OAUTH_REFRESH_TOKEN
            : process.env.OAUTH_REFRESH_TOKEN,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: html,
      attachments: [
        {
          filename: 'hoadondientu.pdf', // <= Here: made sure file name match
          path: __dirname + '/hoadondientu.pdf', // <= Here
          contentType: 'application/pdf',
        },
      ],
    });
    console.log('email sent sucessfully');
  } catch (error) {
    console.log(error, 'email not sent');
  }
};

module.exports = sendMailPDF;
