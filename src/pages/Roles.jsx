// src/Pages/Roles.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // To access groupId from the URL
import {
  createRole,
  deleteRole,
  editRole,
  fetchRoles,
} from "../features/rolesSlice";

const Roles = () => {
  const { groupId } = useParams(); // Get groupId from URL
  const dispatch = useDispatch();
  const rolesState = useSelector((state) => state.roles);
  const { roles = [], loading = false, error = null } = rolesState || {};
  const [newRoleName, setNewRoleName] = useState('');
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedRoleName, setEditedRoleName] = useState("");

  useEffect(() => {
    dispatch(fetchRoles(groupId)); // Fetch roles for the specific group when component mounts
  }, [dispatch, groupId]);

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (newRoleName) {
      dispatch(createRole({ groupId, roleName: newRoleName })); // Dispatch create role action
      setNewRoleName(""); // Clear the input field
    }
  };

  const handleEditRole = (roleId, roleName) => {
    setEditingRoleId(roleId);
    setEditedRoleName(roleName);
  };

  const handleSaveEditRole = (roleId) => {
    dispatch(editRole({ groupId, roleId, newName: editedRoleName }));
    setEditingRoleId(null); // Reset editing mode
    setEditedRoleName("");
  };

  const handleDeleteRole = (roleId) => {
    dispatch(deleteRole({ groupId, roleId }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Roles for Group {groupId}</h1>

      {/* Create Role Form */}
      <form onSubmit={handleCreateRole} className="mb-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter role name"
          />
          <Button type="submit" size="sm">
            Create Role
          </Button>
        </div>
      </form>

      {/* Loading and Error Handling */}
      {loading && <p>Loading roles...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Roles List */}
      <div>
        {roles.length > 0 ? (
          <ul>
            {roles.map((role) => (
              <li key={role.id} className="mb-2">
                {editingRoleId === role.id ? (
                  <div>
                    <Input
                      type="text"
                      value={editedRoleName}
                      onChange={(e) => setEditedRoleName(e.target.value)}
                      className="p-2 border border-gray-300 rounded mr-2"
                    />
                    <Button
                      onClick={() => handleSaveEditRole(role.id)}
                      size="sm"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>{role.name}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditRole(role.id, role.name)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeleteRole(role.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No roles available for this group.</p>
        )}
      </div>
    </div>
  );
};

export default Roles;
