import { NavLink, useNavigate } from 'react-router-dom';
import { Palette, Briefcase, Clock, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: 'Dashboard', icon: <Palette size={20} />, path: '/dashboard' },
  { name: 'Project', icon: <Briefcase size={20} />, path: '/upload' },
  { name: 'Chart', icon: <BarChart2 size={20} />, path: '/charts' },
  { name: 'History', icon: <Clock size={20} />, path: '/history' },
  
  { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];

const Sidebar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
 
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-indigo-500 text-white min-h-screen rounded-tr-3xl p-4 space-y-6">
      <div className="text-2xl font-semibold mb-8">
        YOKI <span className="font-light">Excel</span>
      </div>
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-600 ${isActive ? 'bg-white text-indigo-600 font-semibold' : ''}`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-600"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
