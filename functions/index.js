const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// --- Konfigurasi Gmail untuk Nodemailer ---
const gmailEmail = functions.config().gmail?.email || process.env.GMAIL_EMAIL;
const gmailAppPassword = functions.config().gmail?.password || process.env.GMAIL_PASSWORD;

if (!gmailEmail || !gmailAppPassword) {
  throw new Error("Konfigurasi Gmail tidak ditemukan. Pastikan sudah disetel di environment.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailAppPassword,
  },
});

// --- Fungsi: Kirim Email Verifikasi ke Alumni Baru ---
exports.sendVerificationEmail = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const email = data.email;
    const name = data.name;

    const mailOptions = {
      from: `"Admin Busfa" <${gmailEmail}>`,
      to: email,
      subject: "Pendaftaran Anda Diterima",
      html: `
        <p>Halo ${name} 👋,</p>
        <p>Pendaftaran anda sebagai alumni telah <strong>DITERIMA</strong> 🥳.</p>
        <p>Silakan masuk menggunakan akun yang telah didaftarkan.</p>
        <p>Terima kasih 🫶.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email terkirim ke ${email}`);
    } catch (error) {
      console.error("❌ Gagal mengirim email:", error);
    }
  });

// --- Fungsi: Kirim Notifikasi Saat Pekerjaan Baru Ditambahkan ---
exports.notifyNewJob = functions.firestore
  .document("jobs/{jobId}")
  .onCreate(async (snap, context) => {
    const newJob = snap.data();

    try {
      const usersSnapshot = await admin.firestore().collection("users").get();
      const tokens = usersSnapshot.docs
        .map(doc => doc.data().fcmToken)
        .filter(token => typeof token === "string" && token.length > 0);

      if (tokens.length === 0) {
        console.log("ℹ️ Tidak ada token FCM ditemukan.");
        return null;
      }

      const message = {
        tokens: tokens,
        notification: {
          title: "Lowongan Baru Tersedia!",
          body: `${newJob.title} di ${newJob.location}`,
        },
        data: {
          screen: 'job', 
        }
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(`✅ Notifikasi berhasil dikirim ke ${response.successCount} alumni`);
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.warn(`❌ Token gagal: ${tokens[idx]}\nError:`, resp.error);
          }
        });
      }
    } catch (error) {
      console.error("❌ Gagal mengirim notifikasi:", error);
    }
  });

  // --- Fungsi: Kirim Notifikasi Saat Informasi Kegiatan Baru Ditambahkan ---
exports.notifyNewActivity = functions.firestore
  .document("kegiatan/{activityId}")
  .onCreate(async (snap, context) => {
    const newActivity = snap.data();

    try {
      const usersSnapshot = await admin.firestore().collection("users").get();
      const tokens = usersSnapshot.docs
        .map(doc => doc.data().fcmToken)
        .filter(token => typeof token === "string" && token.length > 0);

      if (tokens.length === 0) {
        console.log("ℹ️ Tidak ada token FCM ditemukan.");
        return null;
      }

      const message = {
        tokens: tokens,
        notification: {
          title: "Ada Kegiatan Baru!",
          body: `${newActivity.title} pada ${newActivity.date}`,
        },
        data: {
          screen: 'activities', 
        }
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(`✅ Notifikasi berhasil dikirim ke ${response.successCount} alumni`);
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.warn(`❌ Token gagal: ${tokens[idx]}\nError:`, resp.error);
          }
        });
      }
    } catch (error) {
      console.error("❌ Gagal mengirim notifikasi:", error);
    }
  });
