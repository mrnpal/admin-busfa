// /hooks/useActivities.js
import { useState, useEffect } from "react";
import {
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
} from "../services/activityService";

export default function useActivities() {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
  });
  const [editingActivity, setEditingActivity] = useState(null);
  const [deletingActivity, setDeletingActivity] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const data = await getActivities();
    setActivities(data);
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    await addActivity(newActivity);
    setNewActivity({ title: "", description: "", date: "", image: null });
    fetchActivities();
  };

  const handleEditActivityClick = (activity) => setEditingActivity(activity);

  const handleEditActivityChange = (e) => {
    setEditingActivity({ ...editingActivity, [e.target.name]: e.target.value });
  };

  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    await updateActivity(editingActivity);
    setEditingActivity(null);
    fetchActivities();
  };

  const handleDeleteActivityClick = (activity) => setDeletingActivity(activity);

  const confirmDeleteActivity = async () => {
    await deleteActivity(deletingActivity.id);
    setDeletingActivity(null);
    fetchActivities();
  };

  return {
    activities,
    newActivity,
    setNewActivity,
    handleAddActivity,
    editingActivity,
    setEditingActivity,
    handleEditActivityClick,
    handleEditActivityChange,
    handleUpdateActivity,
    deletingActivity,
    setDeletingActivity,
    handleDeleteActivityClick,
    confirmDeleteActivity,
  };
}
