const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = process.env.SEND_GRID_KEY;
sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  // const msg = {
  //   to: email,
  //   from: 'seanwhayes87@gmail.com',
  //   subject: 'Welcome to the best app ever',
  //   text: `You\'re the best ${name}, than;s for signing up`;
  //   html: <html></html>
  // }
  // sgMail.send(msg);
}

const sendGoodbyeEmail = ( email, name ) => {
    // const msg = {
  //   to: email,
  //   from: 'seanwhayes87@gmail.com',
  //   subject: 'Goodbye :(',
  //   text: `We\'re sad to see you go`;
  //   html: <html></html>
  // }
  // sgMail.send(msg);
}

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
}