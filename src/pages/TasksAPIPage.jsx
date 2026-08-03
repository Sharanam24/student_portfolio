import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:5000';

// ── Backend status indicator ────────────────────────────────────────────────
function BackendStatus({ online }) {
  return (
    <div className="backend-status">
      <span className={`backend-status__dot${online ? ' backend-status__dot--online' : ''}`} />
      {online ? 'Backend: Online (Port 5000)' : 'Backend: Offline — start server on port 5000'}
    </div>
  );
}

// ── Individual task card ────────────────────────────────────────────────────
function TaskCard({ task, onDelete, onToggle, onEdit }) {
  return (
    <div className="task-card">
      <div className="task-card__top">
        <span className="task-card__id">#{task.id}</span>
        <span className="task-card__title">{task.title}</span>
      </div>
      <div className="task-card__row">
        <span className={`task-badge${task.completed ? ' task-badge--done' : ' task-badge--pending'}`}>
          {task.completed ? 'COMPLETED' : 'PENDING'}
        </span>
        <div className="task-card__actions">
          <button className="task-btn task-btn--edit" onClick={() => onEdit(task)}>Edit</button>
          <button
            className="task-btn task-btn--toggle"
            onClick={() => onToggle(task)}
          >
            {task.completed ? 'Mark Pending' : 'Mark Done'}
          </button>
          <button className="task-btn task-btn--delete" onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
      {task.description && (
        <p className="task-card__desc">{task.description}</p>
      )}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function TasksAPIPage() {
  const [tasks, setTasks]       = useState([]);
  const [online, setOnline]     = useState(false);
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [editTask, setEditTask] = useState(null); // task being edited
  const [error, setError]       = useState('');

  // fetch all tasks and update online status
  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error();
      setTasks(await res.json());
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Create ──────────────────────────────────────────────────────────────
  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Task title is required.'); return; }
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: desc.trim() }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setTitle(''); setDesc('');
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to create task.');
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    try {
      await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch {
      setError('Failed to delete task.');
    }
  }

  // ── Toggle completed ────────────────────────────────────────────────────
  async function handleToggle(task) {
    try {
      const res = await fetch(`${API}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) throw new Error();
      fetchTasks();
    } catch {
      setError('Failed to update task.');
    }
  }

  // ── Edit (inline: fill form, submit saves via PUT) ──────────────────────
  function handleEdit(task) {
    setEditTask(task);
    setTitle(task.title);
    setDesc(task.description || '');
    setError('');
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Task title is required.'); return; }
    try {
      const res = await fetch(`${API}/tasks/${editTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: desc.trim() }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setEditTask(null); setTitle(''); setDesc('');
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task.');
    }
  }

  function cancelEdit() {
    setEditTask(null); setTitle(''); setDesc(''); setError('');
  }

  return (
    <section className="tasks-page" aria-labelledby="tasks-heading">

      <div className="tasks-page__hero">
        <h2 id="tasks-heading">Task Manager API</h2>
        <p className="tasks-page__subtitle">Manage your tasks with Node/Express REST API backend</p>
      </div>

      <BackendStatus online={online} />

      {!online && (
        <p className="tasks-offline-hint">
          Start the backend: <code>cd task-manager-api-24AIML063 &amp;&amp; node server.js</code>
        </p>
      )}

      <div className="tasks-layout">

        {/* ── Create / Edit form ── */}
        <div className="tasks-form-card">
          <h3>{editTask ? `Edit Task #${editTask.id}` : 'Create Task'}</h3>
          <form onSubmit={editTask ? handleUpdate : handleCreate} noValidate>
            <label className="tasks-form__label" htmlFor="task-title">
              Task Title <span aria-hidden="true">*</span>
            </label>
            <input
              id="task-title"
              className="tasks-form__input"
              type="text"
              placeholder="Task title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <label className="tasks-form__label" htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="tasks-form__textarea"
              placeholder="Task details..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={4}
            />

            {error && <p className="tasks-form__error" role="alert">{error}</p>}

            <button type="submit" className="tasks-form__submit">
              {editTask ? '💾 Save Changes' : '+ Create Task'}
            </button>
            {editTask && (
              <button type="button" className="tasks-form__cancel" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* ── Task list ── */}
        <div className="tasks-list-card">
          <h3>Tasks ({tasks.length})</h3>
          {tasks.length === 0 ? (
            <p className="tasks-empty">
              {online ? 'No tasks yet. Create one!' : 'Connect to backend to see tasks.'}
            </p>
          ) : (
            <div className="tasks-list">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
