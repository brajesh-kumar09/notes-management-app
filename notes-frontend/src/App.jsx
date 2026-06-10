import { Navigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CheckLogin from "./components/CheckLogin.jsx";
import DeleteAccount from "./pages/DeleteAccount";
import "./index.css";

function App() {
  return (<>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<CheckLogin><Register /></CheckLogin>} />
      <Route path="/login" element={<CheckLogin><Login /></CheckLogin>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/delete-account" element={<ProtectedRoute><DeleteAccount /></ProtectedRoute>} />
    </Routes>

    <ToastContainer />
  </>
  );
}

export default App;