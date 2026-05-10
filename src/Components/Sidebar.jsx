// components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Music, 
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  Headphones,
  BarChart3,
  Award,
  User2,
  Mic,
  Album,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
const admin = JSON.parse(localStorage.getItem("admin"));
  const navItems = [
  { 
    path: "/dashboard", 
    name: "Dashboard", 
    icon: LayoutDashboard,
    color: "text-blue-400"
  },
  { 
    path: "/user", 
    name: "User List", 
    icon: User2,
    color: "text-purple-400"
  },
  { 
    path: "/artists", 
    name: "Artist List", 
    icon: Mic,
    color: "text-green-400"
  },
  { 
    path: "/artist-profile-requests", 
    name: "Profile Update Requests", 
    icon: RefreshCw,
    color: "text-orange-400",
  },
  { 
    path: "/music", 
    name: "Music List", 
    icon: Music,
    color: "text-green-400"
  },
  { 
    path: "/album", 
    name: "Album List", 
    icon: Album,
    color: "text-green-400"
  },
  { 
    path: "/artist-approval", 
    name: "Artist Approval", 
    icon: Users,
    color: "text-yellow-400"
  },
  { 
    path: "/music-approval", 
    name: "Music Approval", 
    icon: Music,
    color: "text-purple-400"
  },
];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("admin");
    window.location.href = "/login";
  };

  return (
    <div 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out shadow-xl relative h-full`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 transition-all duration-200 z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <div className="p-6 border-b border-gray-700">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-xs text-gray-400">Music Platform</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
              <Headphones className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 py-6">
        <div className="px-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                ${isActive(item.path) 
                  ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border-l-4 border-purple-500' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? item.color : 'text-gray-400 group-hover:text-white'} transition-colors`} />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.name}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-700 p-4 mt-12">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
            text-red-400 hover:bg-red-500/10 hover:text-red-300
          `}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 bottom-0 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              Logout
            </div>
          )}
        </button>

        {!isCollapsed && (
     
<div className="mt-4 pt-4 border-t border-gray-700">
  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition">

    <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
      <span className="text-sm font-bold text-white uppercase">
        {admin?.email?.charAt(0) || "A"}
      </span>
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white truncate">
        Admin
      </p>

      <p className="text-xs text-gray-400 truncate">
        {admin?.email || "No email found"}
      </p>
    </div>

    <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition" />
  </div>
</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;