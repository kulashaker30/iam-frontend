// src/Pages/Dashboard.jsx
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const groupIdExample = 1; // You can replace this with dynamic value

  const token = localStorage.getItem("token"); // or from Redux store
  debugger;
  if(token) {
    return (
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
            <h2 className="text-xl font-bold mb-6">Dashboard Menu</h2>
            <nav className="space-y-2">
              <Link to="/groups" className="block hover:bg-gray-700 p-2 rounded">Groups</Link>
              <Link to={`/groups/${groupIdExample}/roles`} className="block hover:bg-gray-700 p-2 rounded">Roles</Link>
              <Link to={`/groups/${groupIdExample}/users`} className="block hover:bg-gray-700 p-2 rounded">Users</Link>
              <Link to={`/roles/1/permissions`} className="block hover:bg-gray-700 p-2 rounded">Permissions</Link>
            </nav>
          </aside>
    
          {/* Main content */}
          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
            <p className="mt-4 text-gray-600">Select a menu item to begin.</p>
          </main>
        </div>
      );
  }
  return (<Navigate to="/login" replace />);

};

export default Dashboard;
