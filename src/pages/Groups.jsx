import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGroups, createGroup, deleteGroup } from '../features/groupsSlice';
import axios from 'axios';

function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector(state => state.groups.items);
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    dispatch(fetchGroups());
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3001/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    if (!groupName) return;
    dispatch(createGroup(groupName));
    setGroupName('');
  };

  const handleDeleteGroup = (id) => {
    dispatch(deleteGroup(id));
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (selectedUser && selectedGroup) {
      await axios.post(`http://localhost:3001/api/groups/${selectedGroup}/users`, { userIds: [parseInt(selectedUser)] }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  return (
    <div className="mt-4">
      <h2>Groups</h2>
      <form onSubmit={handleGroupSubmit} className="mb-3 row g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <button type="submit" className="btn btn-primary">Add Group</button>
        </div>
      </form>

      <table className="table table-bordered mb-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(g => (
            <tr key={g.id}>
              <td>{g.name}</td>
              <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteGroup(g.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Assign User to Group</h4>
      <form onSubmit={handleAssign} className="row g-3">
        <div className="col-md-5">
          <select className="form-select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Select User</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
        <div className="col-md-5">
          <select className="form-select" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
            <option value="">Select Group</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100">Assign</button>
        </div>
      </form>
    </div>
  );
}

export default Groups;
