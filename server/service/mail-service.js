const nodeMailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })
    }

    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Account activation at ${process.env.API_URL}`,
            text: '',
            html: `
            <div>
                <h1>For activation open the link</h1>
                <a href="${link}">${link}</a>
            </div>
            `
        })
    }

}

module.exports = new MailService()