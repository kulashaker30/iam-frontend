import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../features/authSlice";

export function RegisterForm({ className, ...props }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
  });
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Register user
    const registerResult = await dispatch(registerUser(form));

    // 2. If successful, login automatically
    if (registerUser.fulfilled.match(registerResult)) {
      const loginResult = await dispatch(
        loginUser({ username: form.username, password: form.password })
      );

      // 3. If login succeeds, store token and navigate
      if (loginUser.fulfilled.match(loginResult)) {
        localStorage.setItem("token", loginResult.payload.token);
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className || ""}`} {...props}>
      <div className="rounded-xl border border-neutral-600 bg-white text-neutral-700 shadow p-4 space-y-2.5">
        <h2 className="text-2xl font-bold">IAM Register</h2>
        <div className="p-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <label>First Name</label>
                <input
                  placeholder="First Name"
                  type="text"
                  className="border rounded-md p-2"
                  onChange={handleChange}
                  name="firstname"
                />
              </div>
              <div className="grid gap-2">
                <label>Last Name</label>
                <input
                  placeholder="Last Name"
                  type="text"
                  className="border rounded-md p-2"
                  onChange={handleChange}
                  name="lastname"
                />
              </div>
              <div className="grid gap-2">
                <label>Email</label>
                <input
                  placeholder="Email"
                  type="email"
                  className="border rounded-md p-2"
                  onChange={handleChange}
                  name="email"
                />
              </div>
              <div className="grid gap-2">
                <label>Username</label>
                <input
                  placeholder="Username"
                  type="text"
                  className="border rounded-md p-2"
                  onChange={handleChange}
                  name="username"
                />
              </div>
              <div className="grid gap-2">
                <label>Password</label>
                <input
                  placeholder="Password"
                  type="password"
                  className="border rounded-md p-2"
                  onChange={handleChange}
                  name="password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error.message || "Registration failed"}
              </p>
            )}

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
