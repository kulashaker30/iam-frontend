import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createGroup,
  deleteGroup,
  fetchGroups,
  fetchGroupUsers,
  assignUsersToGroup,
  unassignUserFromGroup,
} from "../features/groupsSlice";

function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.items);
  const groupUsers = useSelector((state) => state.groups.groupUsers);
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchGroups());
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    if (selectedGroup) {
      dispatch(fetchGroupUsers(selectedGroup));
      setSelectedUsers([]);
    }
  }, [dispatch, selectedGroup]);

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
    if (selectedGroup === String(id)) {
      setSelectedGroup("");
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (selectedUsers.length && selectedGroup) {
      await dispatch(assignUsersToGroup({ groupId: selectedGroup, userIds: selectedUsers }));
      dispatch(fetchGroupUsers(selectedGroup));
      setSelectedUsers([]);
    }
  };

  const handleUnassign = async (userId) => {
    await dispatch(unassignUserFromGroup({ groupId: selectedGroup, userId }));
    dispatch(fetchGroupUsers(selectedGroup));
  };

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      {/* Group Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
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

      {/* Group List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((g) => (
          <div
            key={g.id}
            className={`bg-white shadow p-4 rounded-lg flex justify-between items-center cursor-pointer ${
              selectedGroup === String(g.id) ? "border-2 border-blue-500" : "border"
            }`}
            onClick={() => setSelectedGroup(String(g.id))}
          >
            <span className="text-lg text-gray-700">{g.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteGroup(g.id);
              }}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Assign Users */}
      {selectedGroup && (
        <div className="mt-10 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Assign Users</h3>
          <form onSubmit={handleAssign} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
              {users.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-blue-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.id)}
                    onChange={() => handleCheckboxChange(u.id)}
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">{u.username}</span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              disabled={!selectedUsers.length}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Assign Selected
            </button>
          </form>
        </div>
      )}

      {/* Group Members */}
      {selectedGroup && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Users in Group:{" "}
            <span className="text-blue-600">
              {groups.find((g) => String(g.id) === selectedGroup)?.name}
            </span>
          </h3>
          <div className="bg-white rounded shadow p-4 max-h-64 overflow-y-auto">
            {groupUsers[selectedGroup]?.length === 0 ? (
              <p className="text-gray-500">No users assigned yet.</p>
            ) : (
              <ul className="space-y-2">
                {groupUsers[selectedGroup]?.map((user) => (
                  <li
                    key={user.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span className="text-gray-700">{user.username}</span>
                    <button
                      onClick={() => handleUnassign(user.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Unassign
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;
