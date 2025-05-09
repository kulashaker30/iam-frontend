import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Groups from "./pages/Groups";
import Users from "./pages/Users";
import Dashboard from "./pages/Daashboard"; // typo? Should be Dashboard?
import PrivateRoute from "./PrivateRoute";
import Roles from "./pages/Roles";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Routes */}
          {/*//<Route element={<PrivateRoute />}> */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:groupId/users" element={<Users />} />
            <Route path="/groups/:groupId/roles" element={<Roles />} />
           {/*//<Route element={<PrivateRoute />}> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;