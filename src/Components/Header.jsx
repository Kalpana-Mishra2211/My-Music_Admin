import { useState } from "react";
import { 
  Menu, 
  Music, 
  Search, 
  Shield, 
  Bell, 
  Settings, 
  LogOut,
  Users,
  X
} from "lucide-react";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const notifications = [
    { id: 1, message: "New artist registration pending", time: "2 min ago", read: false },
    { id: 2, message: "Album 'Summer Vibes' needs review", time: "1 hour ago", read: false },
    { id: 3, message: "Weekly report is ready", time: "3 hours ago", read: true },
    { id: 4, message: "System update completed", time: "1 day ago", read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    console.log("Searching:", e.target.value);
  };

  const handleMarkAllRead = () => {
    console.log("Mark all as read");
    setShowNotifications(false);
  };

  const handleViewAllNotifications = () => {
    console.log("View all notifications");
    setShowNotifications(false);
  };

  const handleProfileClick = () => {
    console.log("Navigate to profile");
    setShowUserMenu(false);
  };

  const handleSettingsClick = () => {
    console.log("Navigate to settings");
    setShowUserMenu(false);
  };

  const handleLogoutClick = () => {
    console.log("Logout user");
    setShowUserMenu(false);
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleMenuClick}
              className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-2 rounded-xl">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  MusicAdmin
                </h1>
                <p className="text-xs text-gray-500">Content Management Platform</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Search artists, songs, albums..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-sm"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Admin Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Admin</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-purple-600 hover:text-purple-700"
                      >
                        Mark all read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition ${!notif.read ? 'bg-purple-50' : ''}`}
                      >
                        <p className="text-sm text-gray-800">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100 text-center">
                    <button 
                      onClick={handleViewAllNotifications}
                      className="text-xs text-purple-600 hover:text-purple-700"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button 
              onClick={handleSettingsClick}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AD</span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@musicadmin.com</p>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">admin@musicadmin.com</p>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Profile
                    </button>
                    <button 
                      onClick={handleSettingsClick}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogoutClick}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-6 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;