import React from "react";
import { faker } from "@faker-js/faker";
import { db } from "../firebase"; // pastikan path firebase.js kamu benar
import { collection, addDoc } from "firebase/firestore";

const GenerateDummyAlumni = () => {
  const generateAndUploadDummyAlumni = async () => {
    const alumniCollection = collection(db, "alumni");

    for (let i = 0; i < 500; i++) {
      const birthDateObj = faker.date.birthdate({ min: 1995, max: 2005, mode: "year" });

      const dummyAlumni = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        indukNumber: faker.number.int({ min: 100000, max: 999999 }).toString(),
        birthPlaceDate: `${faker.location.city()}, ${birthDateObj.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`,
        education: faker.helpers.arrayElement(["MA", "MTS"]),
        dateEntry: faker.date.past({ years: 10 }).toISOString().split("T")[0],
        parentName: faker.person.fullName(),
        address: "Besuki Kab. Situbondo",
        createdAt: Date.now(),
      };

      try {
        await addDoc(alumniCollection, dummyAlumni);
        console.log(`✅ Alumni ${i + 1} berhasil diupload`);
      } catch (err) {
        console.error(`❌ Gagal upload alumni ke-${i + 1}`, err);
      }
    }

    alert("✅ 500 alumni berhasil ditambahkan ke Firestore.");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🎓 Generate Dummy Alumni</h2>
      <p>Tekan tombol di bawah untuk mengisi database dengan 500 data alumni dummy.</p>
      <button onClick={generateAndUploadDummyAlumni} className="btn btn-danger">
        Generate & Upload 500 Alumni
      </button>
    </div>
  );
};

export default GenerateDummyAlumni;
