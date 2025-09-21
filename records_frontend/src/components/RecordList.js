import React from 'react';
import classNames from 'classnames';

function EmptyState() {
  return (
    <div className="text-center py-5">
      <div className="mb-3">
        <span className="badge badge-soft rounded-pill px-3 py-2">No data</span>
      </div>
      <h5 className="mb-1">No records yet</h5>
      <p className="text-muted-700 mb-0">Create your first record using the button above.</p>
    </div>
  );
}

/**
 * RecordList renders desktop table and mobile cards
 */
export default function RecordList({ records, onEdit, onDelete }) {
  if (!records?.length) return <EmptyState />;

  return (
    <>
      {/* Desktop table */}
      <div className="table-responsive desktop-only">
        <table className="table table-striped table-hover align-middle ocean">
          <thead>
            <tr>
              <th style={{ width: 64 }}></th>
              <th>Title</th>
              <th>Description</th>
              <th style={{ width: 140 }} className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.imageUrl ? (
                    <img className="image-thumb" src={r.imageUrl} alt={r.title} />
                  ) : (
                    <div className="image-thumb d-inline-flex align-items-center justify-content-center bg-light text-muted">
                      N/A
                    </div>
                  )}
                </td>
                <td>
                  <div className="fw-semibold">{r.title}</div>
                  <div className="small text-muted">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
                </td>
                <td>
                  <div className="text-truncate" style={{ maxWidth: 520 }}>{r.description}</div>
                </td>
                <td className="text-end">
                  <div className="btn-group" role="group" aria-label="actions">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(r)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(r)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="mobile-only">
        {records.map((r) => (
          <div key={r.id} className="card ocean record-card">
            <div className="card-body d-flex gap-3">
              {r.imageUrl ? (
                <img className="image-thumb" src={r.imageUrl} alt={r.title} />
              ) : (
                <div className={classNames('image-thumb d-inline-flex align-items-center justify-content-center bg-light text-muted')}>N/A</div>
              )}
              <div className="flex-grow-1">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <h6 className="mb-1">{r.title}</h6>
                    <div className="small text-muted">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
                  </div>
                  <span className="badge badge-soft ms-2">#{r.id}</span>
                </div>
                <p className="mt-2 mb-3 text-muted-700">{r.description}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(r)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(r)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
