// /services/activityService.js
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const activityCollection = collection(db, "kegiatan");
const storage = getStorage();

export const getActivities = async () => {
  const snapshot = await getDocs(activityCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addActivity = async (activity) => {
  let imageUrl = "";

  if (activity.image) {
    const imageRef = ref(storage, `kegiatan/${activity.image.name}-${Date.now()}`);
    const snapshot = await uploadBytes(imageRef, activity.image);
    imageUrl = await getDownloadURL(snapshot.ref);
  }

  await addDoc(activityCollection, {
    title: activity.title,
    description: activity.description,
    date: activity.date,
    imageUrl,
    location: activity.location,
    time: activity.time,
  });
};

export const updateActivity = async (activity) => {
  const { id, title, description, date, location, time } = activity;
  await updateDoc(doc(db, "kegiatan", id), { title, description, date, location, time });
};

export const deleteActivity = async (id) => {
  await deleteDoc(doc(db, "kegiatan", id));
};
