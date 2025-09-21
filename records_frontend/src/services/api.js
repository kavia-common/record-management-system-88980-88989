/**
 * API client for records_database backend.
 * Uses axios for HTTP requests. The base URL is taken from REACT_APP_RECORDS_API_BASE.
 * The backend is expected to expose REST endpoints:
 *   GET    /records
 *   POST   /records           (multipart/form-data for image)
 *   PUT    /records/:id       (multipart/form-data for image updates)
 *   DELETE /records/:id
 */
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_RECORDS_API_BASE || '/api';

// Create axios instance with sane defaults
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Accept': 'application/json' },
  timeout: 15000,
});

// Helper to build FormData from record object
function toFormData({ title, description, imageFile }) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('description', description);
  if (imageFile instanceof File) {
    fd.append('image', imageFile);
  }
  return fd;
}

// PUBLIC_INTERFACE
export async function listRecords(signal) {
  /** List all records. Returns array of { id, title, description, imageUrl, createdAt } */
  const res = await api.get('/records', { signal });
  return res.data;
}

// PUBLIC_INTERFACE
export async function createRecord(payload, signal) {
  /** Create a record. payload: { title, description, imageFile } */
  const res = await api.post('/records', toFormData(payload), {
    signal,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateRecord(id, payload, signal) {
  /** Update a record by id. payload: { title, description, imageFile? } */
  const res = await api.put(`/records/${id}`, toFormData(payload), {
    signal,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteRecord(id, signal) {
  /** Delete a record by id */
  const res = await api.delete(`/records/${id}`, { signal });
  return res.data;
}

// PUBLIC_INTERFACE
export async function getAiSummaryStub(record) {
  /**
   * Placeholder for future AI integration.
   * Accepts a record and returns a mocked summary. Replace with real AI call later.
   */
  // Example: integrate with an AI service here (OpenAI, custom model, etc.)
  return `Summary: ${record.title} — ${record.description?.slice(0, 80) || ''}`.trim();
}
