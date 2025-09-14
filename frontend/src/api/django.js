import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // Django API base

export const listApplications = async () => {
  const res = await axios.get(`${BASE_URL}/applications/`);
  return res.data;
};

export const createApplication = async (data, resumeMarkdown) => {
  console.log("Creating application");
  console.log(resumeMarkdown);
  const res = await axios.post(`${BASE_URL}/applications/`, {
    company_name: data.company,
    position: data.role,
    date_applied: data.dateApplied,
    status: data.status,
    notes: data.notes,
    resume: resumeMarkdown
      ? { title: `${data.company} Resume`, content_md: resumeMarkdown }
      : null,
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

export const createReminder = async (payload) =>
  (await axios.post(`${BASE_URL}/reminders/`, payload)).data;

export const deleteReminder = async (id) =>
  axios.delete(`${BASE_URL}/reminders/${id}/`);

export const updateReminder = async (id, patch) =>
  (await axios.patch(`${BASE_URL}/reminders/${id}/`, patch)).data;
// function to upload a resume pdf file
