import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <div className="fixed top-0 left-0 h-screen w-64 bg-slate-900 z-50 flex justify-normal">
        <Navbar />
      </div>

      <main className="ml-64 p-6">{children}</main>
    </div>
  );
}

export default Layout;
