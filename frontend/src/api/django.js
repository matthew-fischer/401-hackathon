import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // Django API base

export const listApplications = async () => {
  const res = await axios.get(`${BASE_URL}/applications/`);
  return res.data;
};

export const createApplication = async (data) => {
  const res = await axios.post(`${BASE_URL}/applications/`, {
    company_name: data.company,
    position: data.role,
    date_applied: data.dateApplied,
    status: data.status,
    notes: data.notes
});
  return res.data;
};

export const updateApplication = async (id, data) => {
  const res = await axios.patch(`${BASE_URL}/applications/${id}/`, data);
  return res.data;
};

export const deleteApplication = async (id) => {
  await axios.delete(`${BASE_URL}/applications/${id}/`);
};

export const listReminders = async () => {
  const res = await axios.get(`${BASE_URL}/reminders/`);
  return res.data;
};
// function to upload a resume pdf file