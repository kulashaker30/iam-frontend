import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Login from "./pages/Login";
import Permissions from "./pages/Permissions";
import Register from "./pages/Register";
import Roles from "./pages/Roles";
import Users from "./pages/Users";
import PrivateRoute from "./PrivateRoute";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirect to /dashboard if logged in */}
      <Route
        path="/"
        element={
          token ? <Navigate to="/" /> : <Navigate to="/login" />
        }
      />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />}>
          <Route path="groups" element={<Groups />} />
          <Route path="roles" element={<Roles />} />
          <Route path="users" element={<Users />} />
          <Route path="permissions" element={<Permissions />} />
        </Route>
      </Route>

      {/* Catch-all route to handle invalid URLs */}
      <Route
        path="*"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
