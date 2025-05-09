import { initializeApp } from "firebase-admin/app";
import nodemailer from "nodemailer";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";

// Define your secrets
const gmailEmail = defineSecret('GMAIL_EMAIL');
const gmailAppPassword = defineSecret('GMAIL_PASSWORD');

initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail.value(),
    pass: gmailAppPassword.value(),
  },
});

export const sendVerificationEmail = onDocumentCreated(
  {
    document: "alumniVerified/{userId}",
    secrets: [gmailEmail, gmailAppPassword],
  },
  async (event) => {
    const data = event.data.data();
    const email = data.email;
    const name = data.name;

    const mailOptions = {
      from: `"Admin Busfa" <${gmailEmail.value()}>`,
      to: email,
      subject: "Pendaftaran Anda Diterima",
      html: `
        <p>Halo ${name},</p>
        <p>Pendaftaran anda sebagai alumni telah <strong>diterima</strong>.</p>
        <p>Silahkan masuk menggunakan akun yang telah didaftarkan</p>
        <p>Terima kasih.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email terkirim ke", email);
    } catch (error) {
      console.error("Gagal mengirim email:", error);
    }
  }
);