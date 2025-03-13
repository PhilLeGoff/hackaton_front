import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { NotificationProvider } from "./NotificationContext.jsx"; // ✅ Use the correct path

const user = JSON.parse(localStorage.getItem("user")) || null; // ✅ Handle missing user

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider user={user}>
      <App />
    </NotificationProvider>
  </StrictMode>
);
