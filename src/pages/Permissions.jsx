import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPermissions,
  createPermission,
  deletePermission,
  editPermission,
  assignRolesToPermission,
} from '../features/permissionsSlice';
import { fetchRoles } from '../features/rolesSlice';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

const Permissions = () => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions.items);
  const roles = useSelector((state) => state.roles.items);
  const [newPermission, setNewPermission] = useState('');
  const [selectedPermissionId, setSelectedPermissionId] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [search, setSearch] = useState('');
  const [permissionError, setPermissionError] = useState(''); // Error state for permission name

  useEffect(() => {
    dispatch(fetchPermissions());
    dispatch(fetchRoles());
  }, [dispatch]);

  const toggleRole = (id) => {
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handlePermissionSelect = (id) => {
    setSelectedPermissionId(id);
    const perm = permissions.find(p => p.id === id);
    if (perm) {
      const ids = typeof perm.roleIds === 'string' ? JSON.parse(perm.roleIds) : perm.roleIds;
      setSelectedRoleIds(ids || []);
    }
  };

  const handleCreatePermission = (e) => {
    e.preventDefault();
    
    // Check if the permission name is empty
    if (!newPermission.trim()) {
      setPermissionError('Permission name is required.');
      return;
    }

    // If valid, dispatch createPermission action
    setPermissionError(''); // Clear error
    dispatch(createPermission({ name: newPermission }));

    // Reset the permission select and un-check all roles
    setNewPermission('');
    setSelectedPermissionId(''); // Reset selected permission
    setSelectedRoleIds([]); // Un-check all roles
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Permissions</h2>

      <Card className="mb-6">
        <CardHeader><CardTitle>Create Permission</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePermission} className="flex gap-2">
            <Input
              value={newPermission}
              onChange={(e) => {
                setNewPermission(e.target.value);
                if (permissionError) setPermissionError(''); // Clear error on input change
              }}
              placeholder="Permission name"
            />
            {permissionError && <span className="text-sm text-red-500">{permissionError}</span>}
            <Button type="submit" disabled={!newPermission.trim()}>
              Create
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Select Permission</CardTitle></CardHeader>
          <CardContent>
            <Select value={selectedPermissionId} onValueChange={handlePermissionSelect}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select permission" /></SelectTrigger>
              <SelectContent>
                {permissions.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Assign Roles</CardTitle></CardHeader>
          <CardContent>
            <Input
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {roles
                .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
                .map(role => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedRoleIds.includes(role.id)}
                      onCheckedChange={() => toggleRole(role.id)}
                    />
                    <Label>{role.name}</Label>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              disabled={!selectedPermissionId}
              onClick={() => {
                dispatch(assignRolesToPermission({
                  permissionId: selectedPermissionId,
                  roleIds: selectedRoleIds
                }));
                setSelectedPermissionId('');
                setSelectedRoleIds([]);
              }
            }
            >
              Save Assignment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Permissions;
