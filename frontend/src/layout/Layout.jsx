import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast"; // ✅ Import the Toaster

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>


      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </div>
  );
};

export default Layout;
