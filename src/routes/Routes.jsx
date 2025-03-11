import { Routes, Route, Navigate } from "react-router-dom";
import Accueil from "../pages/accueil/Accueil";
import Login from "../pages/login/Login";
import SignUp from "../pages/signup/Signup";
import Layout from "../components/layout/Layout";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} /> 
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<PrivateRoute><Accueil /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
        </Route>
    </Routes>
  );
};

export default AppRoutes;
