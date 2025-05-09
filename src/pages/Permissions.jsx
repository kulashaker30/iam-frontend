// src/Pages/Permissions.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // To access roleId from the URL
import { fetchPermissions, createPermission, editPermission, deletePermission } from '../features/permissionsSlice';

const Permissions = () => {
  const { roleId } = useParams(); // Get roleId from URL
  const dispatch = useDispatch();
  const { permissions, loading, error } = useSelector((state) => state.permissions); // Access permissions from Redux state
  const [newPermissionName, setNewPermissionName] = useState('');
  const [editingPermissionId, setEditingPermissionId] = useState(null);
  const [editedPermissionName, setEditedPermissionName] = useState('');

  useEffect(() => {
    dispatch(fetchPermissions(roleId)); // Fetch permissions for the specific role when component mounts
  }, [dispatch, roleId]);

  const handleCreatePermission = (e) => {
    e.preventDefault();
    if (newPermissionName) {
      dispatch(createPermission({ roleId, permissionName: newPermissionName })); // Dispatch create permission action
      setNewPermissionName(''); // Clear input
    }
  };

  const handleEditPermission = (permissionId, permissionName) => {
    setEditingPermissionId(permissionId);
    setEditedPermissionName(permissionName);
  };

  const handleSaveEditPermission = (permissionId) => {
    dispatch(editPermission({ roleId, permissionId, newName: editedPermissionName }));
    setEditingPermissionId(null); // Reset editing mode
    setEditedPermissionName('');
  };

  const handleDeletePermission = (permissionId) => {
    dispatch(deletePermission({ roleId, permissionId }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Permissions for Role {roleId}</h1>

      {/* Create Permission Form */}
      <form onSubmit={handleCreatePermission} className="mb-4">
        <input
          type="text"
          value={newPermissionName}
          onChange={(e) => setNewPermissionName(e.target.value)}
          placeholder="Enter permission name"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Create Permission
        </button>
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
                    <input
                      type="text"
                      value={editedPermissionName}
                      onChange={(e) => setEditedPermissionName(e.target.value)}
                      className="p-2 border border-gray-300 rounded mr-2"
                    />
                    <button
                      onClick={() => handleSaveEditPermission(permission.id)}
                      className="p-2 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>{permission.name}</span>
                    <button
                      onClick={() => handleEditPermission(permission.id, permission.name)}
                      className="ml-4 p-2 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePermission(permission.id)}
                      className="ml-4 p-2 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
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
