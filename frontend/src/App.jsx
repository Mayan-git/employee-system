import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

const API = "http://localhost:5000";

function Main() {
  const { token } = useAuth();
  return token ? <Dashboard API={API} /> : <Login API={API} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}