// simple in-memory API so UI works before Django
let idCounter = 3;
let applications = [
  { id: 1, company: "Stripe",  role: "Software Engineer", dateApplied: "2025-09-10", status: "applied",  notes: "" },
  { id: 2, company: "Shopify", role: "Intern",            dateApplied: "2025-09-11", status: "phone",    notes: "Prep phone screen" },
];
export async function listApplications(){ await delay(120); return [...applications]; }
export async function createApplication(newApp){ await delay(120); const app={...newApp,id:idCounter++}; applications.unshift(app); return app; }
export async function updateApplication(id, patch){ await delay(120); const i=applications.findIndex(a=>a.id===id); if(i===-1) throw new Error("Not found"); applications[i]={...applications[i],...patch}; return applications[i]; }
function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

