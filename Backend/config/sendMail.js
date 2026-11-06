import {createTransport} from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // use SSL/TLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
})

const sendMail = async (to, otp) => {
    await transporter.sendMail({
    from: process.env.USER_EMAIL, // sender address
    to: to, // list of recipients
    subject: "Reset Password OTP", // subject line
    html: `<p>Your OTP code is: <strong>${otp}</strong><br>
    It will expire in 5 minutes.</p>`, // HTML body
    });
}

export default sendMail