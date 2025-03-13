
// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./routes/Routes";
// import './App.css'; 


// export default function App() {
//   return (
//     <div className="app-container">
//       <div className="glass-overlay"></div>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </div>
//   );
// }


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
