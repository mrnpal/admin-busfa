import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const useAlumni = () => {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    const snapshot = await getDocs(collection(db, "alumni"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAlumni(data);
  };

  const addAlumni = async (newAlumni) => {
    await addDoc(collection(db, "alumni"), newAlumni);
    fetchAlumni();
  };

  const updateAlumni = async (updatedAlumni) => {
    const { id, ...data } = updatedAlumni;
    await updateDoc(doc(db, "alumni", id), data);
    fetchAlumni();
  };

  const deleteAlumni = async (id) => {
    await deleteDoc(doc(db, "alumni", id));
    fetchAlumni();
  };

  return {
    alumni,
    fetchAlumni,
    addAlumni,
    updateAlumni,
    deleteAlumni,
  };
};

export default useAlumni;
