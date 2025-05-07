// /services/alumniService.js
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const alumniCollection = collection(db, "alumni");

export const getAlumni = async () => {
  const snapshot = await getDocs(alumniCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addAlumnus = async (alumnus) => {
  await addDoc(alumniCollection, alumnus);
};

export const updateAlumnus = async (alumnus) => {
  const { id, ...data } = alumnus;
  await updateDoc(doc(db, "alumni", id), data);
};

export const deleteAlumnus = async (id) => {
  await deleteDoc(doc(db, "alumni", id));
};
