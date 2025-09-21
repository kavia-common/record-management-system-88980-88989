# Records Frontend (React + Bootstrap 5)

A modern, responsive web app to manage records with Title, Description, and Image.
Implements CRUD with form validation, Bootstrap 5 UI, and a clean "Ocean Professional" theme.

## Features
- List, create, edit, and delete records
- Image upload with preview (on edit shows current image)
- Responsive UI: desktop table and mobile card view (<576px)
- Bootstrap 5 components, subtle gradients, rounded corners, and soft shadows
- Search filter
- Modals for editing and deleting
- Robust error handling and loading states
- API service layer wired to `records_database` backend
- AI summary stub function ready for future integration

## Environment
Set the API base URL for the backend:

Create `.env` in project root (do not commit secrets):
```
REACT_APP_RECORDS_API_BASE=https://your-records-database-host
```

See `.env.example` for a template.

## Scripts
- `npm start` – run in development
- `npm test` – run tests
- `npm run build` – production build

## Backend contract (expected)
- `GET    /records` → returns array of records: `{ id, title, description, imageUrl, createdAt }`
- `POST   /records` (multipart/form-data with fields: `title`, `description`, `image`) → returns created record
- `PUT    /records/:id` (multipart/form-data with optional `image`) → returns updated record
- `DELETE /records/:id` → returns success status

If your backend differs, adjust `src/services/api.js`.

## Project Structure
- `src/services/api.js` – API client and AI summary stub
- `src/components/RecordList.js` – table and mobile card list
- `src/components/RecordModals.js` – edit/create and delete modals
- `src/theme.css` – Ocean Professional theme tokens and UI polish
- `src/App.js` – application shell, navbar, search, and state management

## Notes
- Image upload uses `multipart/form-data` via `FormData`.
- Validation: Title and Description required; Image required for create (can be adjusted).
- Replace `getAiSummaryStub` with real AI integration when ready.
