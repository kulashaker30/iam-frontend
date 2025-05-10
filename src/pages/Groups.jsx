import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createGroup,
  deleteGroup,
  fetchGroups,
  assignUsersToGroup,
  fetchGroupUsers,
} from "../features/groupsSlice";
import { fetchUsers } from "../features/usersSlice";

function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.items);
  const usersState = useSelector((state) => state.user);
  const { users = [], loading = false, error = null } = usersState || {};
  const [groupName, setGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchUsers()); // Fetch users from global store
  }, [dispatch]);

  useEffect(() => {
    if (selectedGroup) {
      // Fetch group users first
      dispatch(fetchGroupUsers(selectedGroup)).then((action) => {
        const assignedUsers = action.payload?.users || [];
        const assignedIds = assignedUsers.map((u) => u.id);
        setSelectedUserIds(assignedIds);
      });
    } else {
      // Reset selection if no group is selected
      setSelectedUserIds([]);
    }
  }, [selectedGroup, dispatch]);

  

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    if (!groupName) {
      setFormError("Group name is required.");
      return;
    }
    if (!groupName) return;
    dispatch(createGroup(groupName));
    setGroupName("");
  };

  const handleDeleteGroup = (id) => {
    dispatch(deleteGroup(id));
  };

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId); // Unselect the user
      } else {
        return [...prevSelected, userId]; // Select the user
      }
    });
  };

  const handleAssignUsers = async () => {
    if (selectedGroup) {
      await dispatch(
        assignUsersToGroup({ groupId: parseInt(selectedGroup), userIds: selectedUserIds })
      );
      setSelectedGroup("");
      setSelectedUserIds([]);
    }
  };

  const filteredUsers = users?.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase())) ?? [];

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
      
      {formError && (
        <div className="text-red-500 text-sm mt-2">{formError}</div>
      )}

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

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Select Group Dropdown */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-medium text-gray-800 mb-4">
            Assign Users to Group
          </h3>
          <select
            className="w-full px-4 py-2 border rounded-md"
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
        </div>

        {/* All Users List with Search */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">All Users</h4>

          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />

        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredUsers.map((user) => (
            <label key={user.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => toggleUserSelection(user.id)}
                className="accent-blue-600"
              />
              <span>{user.username}</span>
            </label>
          ))}
          {filteredUsers.length === 0 && (
            <p className="text-gray-500 text-sm">No users found.</p>
          )}
        </div>

          <button
            onClick={handleAssignUsers}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Assign Selected
          </button>
        </div>
      </div>
    </div>
  );
}

export default Groups;
