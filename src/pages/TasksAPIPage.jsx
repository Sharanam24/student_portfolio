import { useState, useEffect, useCallback, useRef } from 'react';

const API = 'http://localhost:5000';

// ── Helpers ─────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// today's date in YYYY-MM-DD for the min attribute on date inputs
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ── Toast notification ───────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast__icon">
            {t.type === 'success' && '✅'}
            {t.type === 'delete'  && '🗑️'}
            {t.type === 'error'   && '❌'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Backend status indicator ─────────────────────────────────────────────────
function BackendStatus({ online }) {
  return (
    <div className="backend-status">
      <span className={`backend-status__dot${online ? ' backend-status__dot--online' : ''}`} />
      {online ? 'Backend: Online (Port 5000)' : 'Backend: Offline — start server on port 5000'}
    </div>
  );
}

// ── Task card ────────────────────────────────────────────────────────────────
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
          <button className="task-btn task-btn--edit"   onClick={() => onEdit(task)}>Edit</button>
          <button className="task-btn task-btn--toggle" onClick={() => onToggle(task)}>
            {task.completed ? 'Mark Pending' : 'Mark Done'}
          </button>
          <button className="task-btn task-btn--delete" onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>

      {task.description && <p className="task-card__desc">{task.description}</p>}

      {/* ── Date range ── */}
      {(task.startDate || task.endDate) && (
        <div className="task-card__dates">
          {task.startDate && (
            <span className="task-date">
              <span className="task-date__label">Start:</span> {fmtDate(task.startDate)}
            </span>
          )}
          {task.endDate && (
            <span className="task-date">
              <span className="task-date__label">End:</span> {fmtDate(task.endDate)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function TasksAPIPage() {
  const [tasks,     setTasks]     = useState([]);
  const [online,    setOnline]    = useState(false);
  const [title,     setTitle]     = useState('');
  const [desc,      setDesc]      = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate,   setEndDate]   = useState('');
  const [editTask,  setEditTask]  = useState(null);
  const [error,     setError]     = useState('');
  const [toasts,    setToasts]    = useState([]);
  const toastTimer = useRef({});

  // ── Toast ──────────────────────────────────────────────────────────────
  function showToast(message, type = 'success') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    toastTimer.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete toastTimer.current[id];
    }, 3000);
  }

  useEffect(() => {
    const timers = toastTimer.current;
    return () => Object.values(timers).forEach(clearTimeout);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────
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

  function resetForm() {
    setTitle(''); setDesc(''); setStartDate(''); setEndDate('');
  }

  // ── Create ─────────────────────────────────────────────────────────────
  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Task title is required.'); return; }
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: desc.trim(),
          startDate: startDate || null,
          endDate:   endDate   || null,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      resetForm();
      await fetchTasks();
      showToast('✔ Your data is successfully stored in the server!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to create task.');
      showToast('Failed to create task.', 'error');
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      await fetchTasks();
      showToast('🗑 Your data is successfully deleted from the server!', 'delete');
    } catch {
      setError('Failed to delete task.');
      showToast('Failed to delete task.', 'error');
    }
  }

  // ── Toggle ─────────────────────────────────────────────────────────────
  async function handleToggle(task) {
    try {
      const res = await fetch(`${API}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) throw new Error();
      await fetchTasks();
      showToast('✔ Your data is successfully updated in the server!', 'success');
    } catch {
      setError('Failed to update task.');
      showToast('Failed to update task.', 'error');
    }
  }

  // ── Edit ───────────────────────────────────────────────────────────────
  function handleEdit(task) {
    setEditTask(task);
    setTitle(task.title);
    setDesc(task.description || '');
    setStartDate(task.startDate || '');
    setEndDate(task.endDate || '');
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
        body: JSON.stringify({
          title: title.trim(),
          description: desc.trim(),
          startDate: startDate || null,
          endDate:   endDate   || null,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setEditTask(null); resetForm();
      await fetchTasks();
      showToast('✔ Your data is successfully updated in the server!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to update task.');
      showToast('Failed to update task.', 'error');
    }
  }

  function cancelEdit() {
    setEditTask(null); resetForm(); setError('');
  }

  return (
    <section className="tasks-page" aria-labelledby="tasks-heading">

      <Toast toasts={toasts} />

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

        {/* ── Form ── */}
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
              rows={3}
            />

            {/* ── Date row ── */}
            <div className="tasks-form__date-row">
              <div className="tasks-form__date-group">
                <label className="tasks-form__label" htmlFor="task-start">Start Date</label>
                <input
                  id="task-start"
                  className="tasks-form__input"
                  type="date"
                  min={todayStr()}
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className="tasks-form__date-group">
                <label className="tasks-form__label" htmlFor="task-end">End Date</label>
                <input
                  id="task-end"
                  className="tasks-form__input"
                  type="date"
                  min={todayStr()}
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

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
