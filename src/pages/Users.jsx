// src/Pages/GroupUsers.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGroupUsers,
  createGroupUser,
  editGroupUser,
  deleteGroupUser
} from '../features/usersSlice';

const Users = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.users);

  const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchGroupUsers(groupId));
  }, [groupId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(editGroupUser({ groupId, userId: editId, user: formData }));
      setEditId(null);
    } else {
      dispatch(createGroupUser({ groupId, user: formData }));
    }
    setFormData({ firstname: '', lastname: '', email: '' });
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setFormData({ firstname: user.firstname, lastname: user.lastname, email: user.email });
  };

  const handleDelete = (userId) => {
    dispatch(deleteGroupUser({ groupId, userId }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users in Group {groupId}</h2>
      <form onSubmit={handleSubmit} className="space-x-2 mb-4">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstname}
          onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editId ? 'Update' : 'Create'}
        </button>
      </form>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="flex justify-between border-b pb-2">
            <div>{user.firstname} {user.lastname} ({user.email})</div>
            <div>
              <button onClick={() => handleEdit(user)} className="bg-yellow-400 px-2 py-1 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(user.id)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
