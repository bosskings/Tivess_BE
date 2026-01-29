import nodemailer from "nodemailer";

const sendEmail = (to, message, title) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "tiveesmedia@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    }
  })

  let staticHTML = `<!DOCTYPE html>
  <html lang="en" style="padding: 0; margin: 0; box-sizing: border-box; font-family: sans-serif;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>Tivees</title>

    </head>
    <body style="margin:0;padding:0;box-sizing:border-box;font-family:sans-serif;background-color:#111;">
      <div style="width:100%;background:#111;border-bottom:4px solid #ff0000;padding:24px 0;text-align:center;">
        <span style="color:#fff;font-size:2rem;letter-spacing:2px;font-weight:700;">
          <span style="color:#ff0000">Tivess</span><span style="color:#fff;">Media</span>
        </span>
      </div>
      <div style="background:#181818;max-width:480px;margin:36px auto 0 auto;padding:32px 24px;border-radius:12px;box-shadow:0 0 8px rgba(0,0,0,0.13);text-align:center;">
        <h2 style="color:#ff0000;font-size:1.8rem;margin-bottom:12px;font-weight:700;">Welcome!</h2>
        <p style="color:#fff;font-size:1.08rem;margin-bottom:22px;line-height:1.6;">
          Welcome to <span style="color:#ff0000;font-weight:600;">TivessMedia</span>
        </p>
        <div style="display:inline-block;padding:15px 36px;background:#222;border-radius:8px;margin-bottom:18px;">
          <span style="color:#ff0000;font-size:2rem;letter-spacing:2px;font-weight:700;">
            ${message}
          </span>
        </div>
        <p style="color:#bbb;font-size:0.95rem;margin-top:18px;">
          Welcome! Thank you for joining us at TivessMedia.<br>
          We're excited to have you with us on this journey.
        </p>
      </div>
      <div style="width:100%;text-align:center;background:#111;padding:18px 0 10px 0;margin-top:28px;">
        <span style="color:#999;font-size:0.96rem;">
          &copy; ${new Date().getFullYear()} TivessMedia
        </span>
      </div>
    </body>
    </html>`// HTML body content

  const mailOptions = {
    from: 'Tivess Media <foodgrabafrica@gmail.com>', // sender address
    to: to, // list of receivers
    subject: title, // Subject line
    html: staticHTML
  };

  return new Promise((resolve, reject) => {

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject('error' + err);

      } else {
        resolve('sent' + info);
      }
    })

  })

}

export default sendEmail