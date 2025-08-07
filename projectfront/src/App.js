import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  function fetchTodos() {
    fetch('http://localhost:3000/todo')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(() => setError('Failed to load todos'));
  }

  const handleSubmit = () => {
    setError('');
    if (title.trim() && description.trim()) {
      fetch('http://localhost:3000/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
        .then(async (res) => {
          if (res.ok) {
            setTitle('');
            setDescription('');
            setMessage('Successfully added!');
            setTimeout(() => setMessage(''), 2000);
            fetchTodos();
          } else {
            const errText = await res.text();
            setError(`Create failed: ${errText}`);
          }
        })
        .catch((err) => setError(`Create failed: ${err.message}`));
    } else {
      setError('Title and description are required');
    }
  };

  const handleUpdate = () => {
    setError('');
    if (editTitle.trim() && editDescription.trim()) {
      fetch(`http://localhost:3000/todo/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then(async (res) => {
          if (res.ok) {
            setEditId(-1);
            setEditTitle('');
            setEditDescription('');
            setMessage('Successfully updated!');
            setTimeout(() => setMessage(''), 2000);
            fetchTodos();
          } else {
            const errText = await res.text();
            setError(`Update failed: ${errText}`);
          }
        })
        .catch((err) => setError(`Update failed: ${err.message}`));
    } else {
      setError('Title and description are required for update');
    }
  };

  const delete_item = (id) => {
    fetch(`http://localhost:3000/todo/${id}`, { method: 'DELETE' })
      .then(async (res) => {
        if (res.ok) {
          fetchTodos();
          setMessage('Deleted successfully!');
          setTimeout(() => setMessage(''), 2000);
        } else {
          const errText = await res.text();
          setError(`Delete failed: ${errText}`);
        }
      })
      .catch((err) => setError(`Delete failed: ${err.message}`));
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const cancelEdit = () => {
    setEditId(-1);
    setEditTitle('');
    setEditDescription('');
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <div className="App">
        <h2>TODO LIST</h2>
      </div>

      <div className="row container-sm p-4">
        <div className="form-group d-flex gap-3">
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            type="text"
          />
          <input
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
            type="text"
          />
          <button className="btn btn-secondary" onClick={handleSubmit}>
            SUBMIT
          </button>
        </div>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}
      </div>

      <div className="row mt-3">
        <ul className="list-group">
          {todos.map((item) => (
            <li key={item._id} className="list-group-item d-flex justify-content-between">
              <div className="d-flex flex-column flex-grow-1 me-3">
                {editId === item._id ? (
                  <>
                    <input
                      className="form-control mb-2"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Edit title"
                      type="text"
                    />
                    <input
                      className="form-control"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Edit description"
                      type="text"
                    />
                  </>
                ) : (
                  <>
                    <span>{item.title}</span>
                    <span>{item.description}</span>
                  </>
                )}
              </div>
              <div className="d-flex gap-2 align-items-start">
                {editId === item._id ? (
                  <>
                    <button className="btn btn-warning" onClick={handleUpdate}>
                      Update
                    </button>
                    <button className="btn btn-danger" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-success" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => delete_item(item._id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;