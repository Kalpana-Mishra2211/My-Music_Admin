import Sidebar from "./Components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden">
      
      <div className="bg-gray-900 text-white h-full overflow-y-auto">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 h-full overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;