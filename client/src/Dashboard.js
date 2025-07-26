import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedUsername, setEditedUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/users', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) navigate('/');
        return res.json();
      })
      .then(setUsers);
  }, []);

  const logout = async () => {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    navigate('/');
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    setUsers(users.filter(u => u.id !== id));
  };

  const startEditing = (id, username) => {
    setEditingId(id);
    setEditedUsername(username);
  };

  const saveEdit = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: editedUsername })
    });

    setUsers(users.map(u => (u.id === id ? { ...u, username: editedUsername } : u)));
    setEditingId(null);
    setEditedUsername('');
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {editingId === u.id ? (
              <>
                <input
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                />
                <button onClick={() => saveEdit(u.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {u.username}
                <button onClick={() => startEditing(u.id, u.username)}>Edit</button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}