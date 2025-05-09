// src/components/PrivateRoute.jsx
import { Navigate, useNavigate } from "react-router-dom";


const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // or from Redux store
  return token ?  <Navigate to="/dashboard" replace></Navigate> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
