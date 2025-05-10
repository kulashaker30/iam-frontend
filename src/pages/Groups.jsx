import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  assignUsersToGroup,
  createGroup,
  deleteGroup,
  fetchGroups,
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
        assignUsersToGroup({
          groupId: parseInt(selectedGroup),
          userIds: selectedUserIds,
        })
      );
      setSelectedGroup("");
      setSelectedUserIds([]);
    }
  };

  const filteredUsers =
    users?.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  return (
    <div className="p-6 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Groups</h2>
        <form onSubmit={handleGroupSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Button type="submit">Add Group</Button>
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
            <Button
              size="icon"
              variant="destructive"
              onClick={() => handleDeleteGroup(g.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Select Group Dropdown */}
        <Card>
          <CardHeader>
            <CardTitle>Assign Users to Group</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* All Users List with Search */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search users..."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />

            <div className="max-h-60 overflow-y-auto space-y-2 my-5">
              {filteredUsers.map((user) => {
                const inputId = `user-${user.id}`;
                return (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={inputId}
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                    <Label htmlFor={inputId}>{user.username}</Label>
                  </div>
                );
              })}
              {filteredUsers.length === 0 && (
                <p className="text-gray-500 text-sm">No users found.</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAssignUsers} size="sm">
              Assign Selected
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Groups;
