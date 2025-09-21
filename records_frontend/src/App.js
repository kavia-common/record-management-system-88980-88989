import React, { useEffect, useMemo, useState } from 'react';
import './theme.css';
import RecordList from './components/RecordList';
import { RecordDeleteModal, RecordEditModal } from './components/RecordModals';
import { createRecord, deleteRecord, listRecords, updateRecord, getAiSummaryStub } from './services/api';

// PUBLIC_INTERFACE
function App() {
  /**
   * Records state and UI state management
   */
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  // Modals
  const [showEdit, setShowEdit] = useState(false);
  const [editMode, setEditMode] = useState('create'); // 'create' | 'edit'
  const [current, setCurrent] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  // Load records on mount
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    listRecords(ctrl.signal)
      .then(setRecords)
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Failed to load records'))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const filtered = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return records;
    return records.filter(r =>
      r.title?.toLowerCase().includes(term) ||
      r.description?.toLowerCase().includes(term));
  }, [records, filter]);

  function openCreate() {
    setEditMode('create');
    setCurrent(null);
    setShowEdit(true);
  }

  function openEdit(rec) {
    setEditMode('edit');
    setCurrent(rec);
    setShowEdit(true);
  }

  function openDelete(rec) {
    setCurrent(rec);
    setShowDelete(true);
  }

  async function handleCreateOrUpdate(payload) {
    setBusy(true);
    setError('');
    try {
      if (editMode === 'create') {
        const created = await createRecord(payload);
        setRecords((prev) => [created, ...prev]);
      } else if (current) {
        const updated = await updateRecord(current.id, payload);
        setRecords((prev) => prev.map(r => (r.id === current.id ? updated : r)));
      }
      setShowEdit(false);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Operation failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!current) return;
    setBusy(true);
    setError('');
    try {
      await deleteRecord(current.id);
      setRecords((prev) => prev.filter(r => r.id !== current.id));
      setShowDelete(false);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Delete failed');
    } finally {
      setBusy(false);
    }
  }

  // PUBLIC_INTERFACE
  async function handleGenerateSummary(rec) {
    /**
     * AI Summary stub - prepares for future AI integration.
     * For now, we use a local stub that returns a concise text.
     */
    const text = await getAiSummaryStub(rec);
    alert(text);
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg ocean shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-semibold d-flex align-items-center" href="#home" onClick={(e) => e.preventDefault()}>
            <span className="me-2" style={{ width: 10, height: 10, background: 'var(--primary)', display: 'inline-block', borderRadius: 3 }} />
            Records
          </a>
          <div className="ms-auto d-flex align-items-center gap-2">
            <button className="btn btn-primary ocean" onClick={openCreate}>
              + Add Record
            </button>
          </div>
        </div>
      </nav>

      <header className="ocean-gradient py-4">
        <div className="container">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <h4 className="mb-1">Record Management</h4>
              <p className="text-muted-700 mb-0">Add, view, edit, and delete records with image support.</p>
            </div>
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">Search</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by title or description"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <button className="btn btn-outline-secondary" onClick={() => setFilter('')}>Clear</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container my-4">
        {error && (
          <div className="alert alert-danger rounded-12 shadow-soft d-flex align-items-center" role="alert">
            <span className="me-2">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <div className="card ocean">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-3 text-muted">Loading records…</div>
              </div>
            ) : (
              <>
                <RecordList
                  records={filtered}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
                {!!filtered.length && (
                  <div className="small text-muted-700 mt-3">
                    Showing {filtered.length} of {records.length} record{records.length === 1 ? '' : 's'}.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              const first = records[0];
              if (first) handleGenerateSummary(first);
            }}
            disabled={!records.length}
            title="AI summary stub"
          >
            Generate AI Summary (stub)
          </button>
        </div>
      </main>

      {/* Modals */}
      {showEdit && (
        <RecordEditModal
          mode={editMode}
          record={current}
          onSubmit={handleCreateOrUpdate}
          onClose={() => !busy && setShowEdit(false)}
          show={showEdit}
        />
      )}
      {showDelete && current && (
        <RecordDeleteModal
          record={current}
          onConfirm={handleDelete}
          onClose={() => !busy && setShowDelete(false)}
          show={showDelete}
        />
      )}
    </>
  );
}

export default App;
