const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Konfigurasi Gmail
const gmailEmail = functions.config().gmail?.email || process.env.GMAIL_EMAIL;
const gmailAppPassword = functions.config().gmail?.password || process.env.GMAIL_PASSWORD;

if (!gmailEmail || !gmailAppPassword) {
  throw new Error("Missing email configuration");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailAppPassword,
  },
});

// Fungsi kirim email verifikasi
exports.sendVerificationEmail = functions.firestore
  .document("alumniVerified/{userId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const email = data.email;
    const name = data.name;
    

    // Email notifikasi
    const mailOptions = {
      from: `"Admin Busfa" <${gmailEmail}>`,
      to: email,
      subject: "Pendaftaran Anda Diterima",
      html: `
        <p>Halo ${name} 👋,</p>
        <p>Pendaftaran anda sebagai alumni telah <strong>DITERIMA</strong> 🥳.</p>
        <p>Silahkan masuk menggunakan akun yang telah didaftarkan.</p>
        <p>Terima kasih 🫶.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email terkirim ke", email);
    } catch (error) {
      console.error("Gagal mengirim email:", error);
    }
  });
