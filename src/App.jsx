
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import './App.css'; 


export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
