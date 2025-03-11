import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const Layout = () => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
