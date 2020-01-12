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
        html: `<h1>Potwierdzenie zamówienia</h1>
        <p>Numer transakcji ${idTransaction}
        <b>Witaj ${fullName}?</b>
        <p>Zamówienie zostało zaakceptowane i jest w trakcie realizacji.</p>
        <p>Możesz sprawdzić status zamówienia wchodząc na stronę${process.env.HOST}/tracking/${idTransaction}</p>`
    }
    return transporter.sendMail(message);
}

module.exports = send;

