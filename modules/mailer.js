const nodemailer = require("nodemailer");
const mailerConfig = require("./../config/mailer.js");

const transporter = nodemailer.createTransport({
    host: mailerConfig.host,
    port: mailerConfig.port,
    auth: {
        user: mailerConfig.user,
        pass: mailerConfig.pass
    }
});
function send(data) {
    const { mail, fullName, idTransaction } = data;
    let message = {
        from: 'Paula Handmade',
        to: `${mail}`,
        subject: "Potwierdzenie zakupu",
        text: "Hello world?",
        html: `<b>Witaj${fullName}?</b><h1>Potwierdzamy przyjęcie zamówienia</h1><p>Zamówienie jest w trakcie realizacji</p><p>Możesz sprawdzić status zamówienia wchodząc na stronę${process.env.HOST}/tracking/${idTransaction}</p>`
    }
    return transporter.sendMail(message);
}

module.exports = send;

