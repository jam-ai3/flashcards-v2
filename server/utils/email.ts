// import nodemailer from "nodemailer";

// export async function sendEmail(to: string, subject: string, text: string) {
//   const transporter = nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE, // ex. gmail
//     host: "smtp-mail.outlook.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//     tls: {
//       ciphers: "TLSv1.2",
//     },
//   });
//   const mailOptions = {
//     from: process.env.EMAIL,
//     to,
//     subject,
//     text,
//   };
//   return await transporter.sendMail(mailOptions);
// }
