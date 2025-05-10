// src/Pages/Permissions.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // To access roleId from the URL
import {
  createPermission,
  deletePermission,
  editPermission,
  fetchPermissions,
} from "../features/permissionsSlice";

const Permissions = () => {
  const { roleId } = useParams(); // Get roleId from URL
  const dispatch = useDispatch();
  const { permissions, loading, error } = useSelector(
    (state) => state.permissions
  ); // Access permissions from Redux state
  const [newPermissionName, setNewPermissionName] = useState("");
  const [editingPermissionId, setEditingPermissionId] = useState(null);
  const [editedPermissionName, setEditedPermissionName] = useState("");

  useEffect(() => {
    dispatch(fetchPermissions(roleId)); // Fetch permissions for the specific role when component mounts
  }, [dispatch, roleId]);

  const handleCreatePermission = (e) => {
    e.preventDefault();
    if (newPermissionName) {
      dispatch(createPermission({ roleId, permissionName: newPermissionName })); // Dispatch create permission action
      setNewPermissionName(""); // Clear input
    }
  };

  const handleEditPermission = (permissionId, permissionName) => {
    setEditingPermissionId(permissionId);
    setEditedPermissionName(permissionName);
  };

  const handleSaveEditPermission = (permissionId) => {
    dispatch(
      editPermission({ roleId, permissionId, newName: editedPermissionName })
    );
    setEditingPermissionId(null); // Reset editing mode
    setEditedPermissionName("");
  };

  const handleDeletePermission = (permissionId) => {
    dispatch(deletePermission({ roleId, permissionId }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">
        Permissions for Role {roleId}
      </h1>

      {/* Create Permission Form */}
      <form onSubmit={handleCreatePermission} className="mb-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
            placeholder="Enter permission name"
          />
          <Button type="submit" size="sm">
            Create Permission
          </Button>
        </div>
      </form>

      {/* Loading and Error Handling */}
      {loading && <p>Loading permissions...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Permissions List */}
      <div>
        {permissions.length > 0 ? (
          <ul>
            {permissions.map((permission) => (
              <li key={permission.id} className="mb-2">
                {editingPermissionId === permission.id ? (
                  <div>
                    <Input
                      type="text"
                      value={editedPermissionName}
                      onChange={(e) => setEditedPermissionName(e.target.value)}
                    />
                    <Button
                      onClick={() => handleSaveEditPermission(permission.id)}
                      size="sm"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>{permission.name}</span>
                    <Button
                      onClick={() =>
                        handleEditPermission(permission.id, permission.name)
                      }
                      size="sm"
                      variant="secondary"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeletePermission(permission.id)}
                      size="icon"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No permissions available for this role.</p>
        )}
      </div>
    </div>
  );
};

export default Permissions;
