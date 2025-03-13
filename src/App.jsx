import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ Import toast styles
import "./App.css";

export default function App() {
  return (
    
    <BrowserRouter>
      <ToastContainer /> {/* ✅ Ensures toast notifications appear */}
      <AppRoutes />
    </BrowserRouter>
   
  );
}
