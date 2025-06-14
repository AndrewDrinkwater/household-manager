import React, { useEffect, useState } from 'react';
import {
  uploadBacklogAttachment,
  getBacklogAttachments,
  deleteAttachment,
  getBacklogNotes,
  addBacklogNote,
  UPLOADS_URL
} from '../../api';

export default function BacklogForm({ existing, onSave, onCancel }) {
  const [item, setItem] = useState({
    title: '',
    description: '',
    category: 'Feature',
    priority: 'Medium',
    status: 'To-do'
  });
  const [attachments, setAttachments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (existing) {
      setItem({ ...existing });
      getBacklogAttachments(existing.id).then(r => setAttachments(r.data));
      getBacklogNotes(existing.id).then(r => setNotes(r.data));
    }
  }, [existing]);

  const handleChange = e => setItem({ ...item, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSave(item);
  };

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file || !existing?.id) return;
    setUploading(true);
    await uploadBacklogAttachment(existing.id, file);
    getBacklogAttachments(existing.id).then(r => setAttachments(r.data));
    setUploading(false);
    e.target.value = '';
  };

  const handleDeleteAttachment = async id => {
    if (!window.confirm('Delete this attachment?')) return;
    await deleteAttachment(id);
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !existing?.id) return;
    const resp = await addBacklogNote(existing.id, noteText);
    setNotes([...notes, resp.data]);
    setNoteText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label>Title</label>
          <input name="title" value={item.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Category</label>
          <select name="category" value={item.category} onChange={handleChange}>
            <option value="Feature">Feature</option>
            <option value="Defect">Defect</option>
          </select>
        </div>
        <div>
          <label>Priority</label>
          <select name="priority" value={item.priority} onChange={handleChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label>Status</label>
          <select name="status" value={item.status} onChange={handleChange}>
            <option value="To-do">To-do</option>
            <option value="Doing">Doing</option>
            <option value="Testing">Testing</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Description</label>
          <textarea name="description" value={item.description} onChange={handleChange} rows={3} />
        </div>
        {existing && (
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Attachments</label>
            <div style={{ marginBottom: '0.5em' }}>
              <input type="file" onChange={handleFileChange} disabled={uploading} />
              {uploading && <span style={{ marginLeft: 8 }}>Uploading…</span>}
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {attachments.map(att => (
                <li key={att.id} style={{ marginBottom: 4 }}>
                  <a href={`${UPLOADS_URL}/${att.filename}`} target="_blank" rel="noopener noreferrer">
                    {att.originalname}
                  </a>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteAttachment(att.id)} style={{ marginLeft: 8 }}>
                    Delete
                  </button>
                </li>
              ))}
              {attachments.length === 0 && <li>No attachments yet.</li>}
            </ul>
          </div>
        )}
        {existing && (
          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <label>Notes</label>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {notes.map(note => (
                <li key={note.id}>{note.text}</li>
              ))}
              {notes.length === 0 && <li>No notes yet.</li>}
            </ul>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="text"
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                style={{ flexGrow: 1 }}
              />
              <button type="button" className="btn btn-sm btn-primary" onClick={handleAddNote}>
                Add
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" className="btn btn-warning" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
