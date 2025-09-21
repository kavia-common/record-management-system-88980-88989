import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

/**
 * Edit/Create modal for records
 * Uses Bootstrap 5 modal structure (no JS import required in CRA for basic toggling controlled by React)
 */
export function RecordEditModal({ mode = 'create', record, onSubmit, onClose, show }) {
  const [title, setTitle] = useState(record?.title || '');
  const [description, setDescription] = useState(record?.description || '');
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  useEffect(() => {
    setTitle(record?.title || '');
    setDescription(record?.description || '');
    setImageFile(null);
    setErrors({});
    if (fileRef.current) fileRef.current.value = '';
  }, [record, show]);

  function validate() {
    const e = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Description is required';
    // image not required for edit; required for create if not provided by backend assumption
    if (mode === 'create' && !imageFile) {
      e.image = 'Image is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title: title.trim(), description: description.trim(), imageFile: imageFile || undefined });
  }

  return (
    <div className={classNames('modal fade', { show, 'd-block': show })} tabIndex="-1" role="dialog" aria-modal={show} aria-hidden={!show}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-12 shadow-soft">
          <div className="modal-header">
            <h5 className="modal-title">{mode === 'create' ? 'Add Record' : 'Edit Record'}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label required">Title</label>
                <input
                  type="text"
                  className={classNames('form-control', { 'is-invalid': errors.title })}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a clear, concise title"
                  maxLength={160}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label required">Description</label>
                <textarea
                  className={classNames('form-control', { 'is-invalid': errors.description })}
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the record"
                  maxLength={2000}
                />
                <div className="d-flex justify-content-between">
                  {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
                  <small className="text-muted">{description.length}/2000</small>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label {errors.image ? 'text-danger' : ''}">Image</label>
                <div className="input-group">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className={classNames('form-control', { 'is-invalid': errors.image })}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setImageFile(file || null);
                    }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      if (fileRef.current) {
                        fileRef.current.value = '';
                        setImageFile(null);
                      }
                    }}
                  >
                    Clear
                  </button>
                  {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                </div>
                {record?.imageUrl && mode === 'edit' && (
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <img src={record.imageUrl} alt="current" className="image-thumb" />
                    <small className="text-muted">Current image</small>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary ocean">
                {mode === 'create' ? 'Create' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * Delete confirm modal
 */
export function RecordDeleteModal({ record, onConfirm, onClose, show }) {
  return (
    <div className={classNames('modal fade', { show, 'd-block': show })} tabIndex="-1" role="dialog" aria-modal={show} aria-hidden={!show}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-12 shadow-soft">
          <div className="modal-header">
            <h5 className="modal-title text-danger">Delete Record</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">
              Are you sure you want to delete <strong>{record?.title}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
