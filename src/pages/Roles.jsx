import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRoles,
  createRole,
  deleteRole,
  editRole,
  assignGroupsToRole,
} from "../features/rolesSlice";
import { fetchGroups } from "../features/groupsSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Roles = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles ?? []);
  const { groups } = useSelector((state) => state.groups ?? []);

  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchGroups());
  }, [dispatch]);

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleGroupSelection = (groupId) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleAssignGroups = () => {
    if (selectedRoleId && selectedGroupIds.length > 0) {
      dispatch(assignGroupsToRole({ roleId: selectedRoleId, groupIds: selectedGroupIds }));
      setSelectedGroupIds([]);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Assign Groups to Role</h2>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Role Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Role</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setSelectedRoleId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Group Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Assign Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto space-y-2 my-5">
              {filteredGroups.map((group) => (
                <div key={group.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedGroupIds.includes(group.id)}
                    onCheckedChange={() => toggleGroupSelection(group.id)}
                  />
                  <Label>{group.name}</Label>
                </div>
              ))}
              {filteredGroups.length === 0 && (
                <p className="text-gray-500 text-sm">No groups found.</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAssignGroups} disabled={!selectedRoleId}>
              Assign Selected
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Roles;
