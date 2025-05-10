import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, deleteGroup, fetchGroups } from "../features/groupsSlice";

function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.items);
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchGroups());
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3001/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    if (!groupName) return;
    dispatch(createGroup(groupName));
    setGroupName("");
  };

  const handleDeleteGroup = (id) => {
    dispatch(deleteGroup(id));
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (selectedUser && selectedGroup) {
      await axios.post(
        `http://localhost:3001/api/groups/${selectedGroup}/users`,
        {
          userIds: [parseInt(selectedUser)],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedUser("");
      setSelectedGroup("");
    }
  };

  return (
    <div className="p-6 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Groups</h2>
        <form onSubmit={handleGroupSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Group name"
            className="px-4 py-2 border rounded-md"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Group
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((g) => (
          <div
            key={g.id}
            className="bg-white shadow p-4 rounded-lg flex justify-between items-center"
          >
            <span className="text-lg text-gray-700">{g.name}</span>
            <button
              onClick={() => handleDeleteGroup(g.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium text-gray-800 mb-4">
          Assign User to Group
        </h3>
        <form
          onSubmit={handleAssign}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <select
            className="col-span-2 px-4 py-2 border rounded-md"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <select
            className="col-span-2 px-4 py-2 border rounded-md"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Select Group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Assign
          </button>
        </form>
      </div>
    </div>
  );
}

export default Groups;
