import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  deleteUser,
  editUser,
  fetchUsers,
} from "../features/usersSlice";

const Users = () => {
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.user);
  const { users = [], loading = false, error = null } = usersState || {};

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    const { firstname, lastname, email, username, password } = formData;

    if (!firstname) errors.firstname = "First name is required.";
    if (!lastname) errors.lastname = "Last name is required.";
    if (!email) errors.email = "Email is required.";
    if (!username) errors.username = "Username is required.";
    if (!editId && !password)
      errors.password = "Password is required when creating a user.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const userData = { firstname, lastname, email, username };
    if (!editId || password) userData.password = password;

    if (editId) {
      dispatch(
        editUser({
          userId: editId,
          user: {
            ...formData,
            password:
              formData.password !== ""
                ? formData.password
                : users.find((u) => u.id === editId)?.password,
          },
        })
      );
    } else {
      dispatch(createUser(userData));
    }

    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
    });
    setEditId(null);
    setFormErrors({});
  };

  const handleEdit = (user) => {
    setFormErrors({});
    setEditId(user.id);
    setFormData({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      username: user.username || "",
      password: "",
    });
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-4 mb-6">
        {["firstname", "lastname", "email", "username", "password"].map(
          (field) => (
            <div key={field} className="col-span-1 flex flex-col gap-1">
              <Input
                type={
                  field === "email"
                    ? "email"
                    : field === "password"
                    ? "password"
                    : "text"
                }
                placeholder={
                  field === "password"
                    ? editId
                      ? "Leave blank to keep old password"
                      : "Password"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
              />
              {formErrors[field] && (
                <span className="text-sm text-red-500">
                  {formErrors[field]}
                </span>
              )}
            </div>
          )
        )}

        <div className="col-span-1 flex items-end">
          <Button type="submit" className="w-full">
            {editId ? "Update" : "Create"}
          </Button>
        </div>
      </form>

      {loading && <p className="text-gray-500">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">First Name</th>
            <th className="border px-4 py-2 text-left">Last Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Username</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{user.firstname}</td>
              <td className="border px-4 py-2">{user.lastname}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2 text-center flex justify-center gap-2">
                <Button variant="secondary" onClick={() => handleEdit(user)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {users.length === 0 && !loading && (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
