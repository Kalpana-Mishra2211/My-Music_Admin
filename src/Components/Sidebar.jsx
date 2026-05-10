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
  X,
  Menu,
  User2,
  Mic,
  RefreshCw,
  Album
} from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("admin");
    window.location.href = "/login";
  };

  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="fixed top-4 left-4 z-50 md:hidden bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg shadow-lg"
    >
      {isMobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
    </button>
  );

  const MobileOverlay = () => (
    isMobileOpen && (
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
        onClick={() => setIsMobileOpen(false)}
      />
    )
  );

  const SidebarContent = () => (
    <>
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 transition-all duration-200 z-10 hidden md:block"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      )}

      <div className="p-4 sm:p-6 border-b border-gray-700">
        {!isCollapsed || isMobile ? (
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg flex-shrink-0">
              <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold truncate">Admin Panel</h2>
              <p className="text-xs text-gray-400 truncate">Music Platform</p>
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

      <nav className="flex-1 py-4 sm:py-6 overflow-y-auto">
        <div className="px-2 sm:px-3 space-y-1 sm:space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 group relative
                ${isActive(item.path) 
                  ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border-l-4 border-purple-500' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isActive(item.path) ? item.color : 'text-gray-400 group-hover:text-white'} transition-colors`} />
              {(!isCollapsed || isMobile) && (
                <span className="font-medium text-xs sm:text-sm truncate">{item.name}</span>
              )}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs sm:text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-700 p-3 sm:p-4 mt-auto">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 group relative
            text-red-400 hover:bg-red-500/10 hover:text-red-300
          `}
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span className="font-medium text-xs sm:text-sm">Logout</span>}
          {isCollapsed && !isMobile && (
            <div className="absolute left-full ml-2 bottom-0 bg-gray-800 text-white text-xs sm:text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              Logout
            </div>
          )}
        </button>

        {(!isCollapsed || isMobile) && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-800 transition">
              <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold text-white uppercase">
                  {admin?.email?.charAt(0) || "A"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  Admin
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {admin?.email || "No email found"}
                </p>
              </div>

              <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 cursor-pointer hover:text-white transition flex-shrink-0" />
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <MobileMenuButton />
      <MobileOverlay />
      
      <div 
        className={`
          hidden md:block
          ${isCollapsed ? 'w-20' : 'w-64'}
          bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out shadow-xl relative h-full
        `}
      >
        <SidebarContent />
      </div>

      <div 
        className={`
          fixed md:hidden
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 sm:w-80
          bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-transform duration-300 ease-in-out shadow-xl z-50 h-full top-0 left-0
        `}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;