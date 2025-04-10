import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper function to determine if a link is active
  const isActive = (path) => {
    return currentPath === path || 
           (path !== "/" && currentPath.startsWith(path));
  };

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-6 hidden md:block">
      <h2 className="text-xl font-bold mb-6">Menu</h2>

      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className={`block py-2 px-4 rounded-md transition-colors ${
                isActive("/")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              aria-label="Go to Marketplace"
            >
              Data Marketplace
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className={`block py-2 px-4 rounded-md transition-colors ${
                isActive("/dashboard")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              aria-label="Go to Dashboard"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/verification-panel"
              className={`block py-2 px-4 rounded-md transition-colors ${
                isActive("/verification-panel")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              aria-label="Go to Verification Panel"
            >
              Verification Panel
            </Link>
          </li>
          <li>
            <Link
              to="/role-manager"
              className={`block py-2 px-4 rounded-md transition-colors ${
                isActive("/role-manager")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              aria-label="Go to Role Manager"
            >
              Role Manager
            </Link>
          </li>
          <li>
            <Link
              to="/template"
              className={`block py-2 px-4 rounded-md transition-colors ${
                isActive("/template")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              aria-label="Go to Template Manager"
            >
              Create Template
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;