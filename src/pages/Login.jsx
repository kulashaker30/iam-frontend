import React from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "../components/login-form";

export default function Login() {
  const token = localStorage.getItem("token"); // or from Redux store

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto w-full flex h-screen flex-col justify-center">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
