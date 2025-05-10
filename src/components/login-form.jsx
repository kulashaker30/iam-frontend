import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/authSlice";
import { Input } from "./ui/input";

export function LoginForm({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(result)) {
      localStorage.setItem("token", result.payload.token);
      navigate("/dashboard");
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className || ""}`} {...props}>
      <div className="rounded-xl border border-neutral-600 bg-white text-neutral-700 shadow p-4 space-y-2.5">
        <h2 className="text-2xl font-bold">IAM Login</h2>
        <p>Enter your username and password below to login to your account.</p>
        <div className="p-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <label>Username</label>
                <Input
                  placeholder="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label>Password</label>
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error.message || "Login failed"}
              </p>
            )}

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
