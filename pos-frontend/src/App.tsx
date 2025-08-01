import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Layout from "./components/layout";
import Sales from "./pages/sales";
import Order from "./pages/order";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("refreshToken");
  });

  if (isLoggedIn) {
    const loginTimestamp = localStorage.getItem("login_timestamp");
    const oneDay = 24 * 60 * 60 * 1000;

    if (loginTimestamp && Date.now() - Number(loginTimestamp) > oneDay) {
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("login_timestamp");
      setIsLoggedIn(false);
    }
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Layout setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/dashboard" replace />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/sales" element={<Sales />}></Route>
        <Route path="/order" element={<Order />}></Route>
      </Route>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace></Navigate>
          ) : (
            <LoginPage setIsLoggedIn={setIsLoggedIn} />
          )
        }
      ></Route>
    </Routes>
  );
}

export default App;
