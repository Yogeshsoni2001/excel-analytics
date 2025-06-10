import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Palette, Clock, BarChart2, LogOut, Menu, X, } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: 'Dashboard', icon: <Palette size={20} />, path: '/dashboard' },
  { name: 'Chart', icon: <BarChart2 size={20} />, path: '/charts' },
  { name: 'History', icon: <Clock size={20} />, path: '/history' },
  
];

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
    setDropdownOpen(false);
    setMenuOpen(false);
  };
 
  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
  
    <header className="bg-gradient-to-r from-blue-300 via-blue-800 to-blue-950 text-white  shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Brand */}
        <div className="flex justify-center ">
        <img src="/logo.png" alt="grapiq Logo" className="h-10 w-auto" />
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav + User */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6 items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded text-xs hover:bg-indigo-600  transition ${
                    isActive ? 'underline ' : ''
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Avatar and Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-label="User menu"
            >
              <img
                src="/icons/user.jpg"
                alt="User Avatar"
                className="w-7 h-7 rounded-full object-cover border-2 border-white"
              />
              <span className="text-xs">{user?.name || 'User'}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-base">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'No email'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-xs px-4 py-2 hover:bg-blue-400 hover:text-white flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-600 ${
                  isActive ? 'bg-white text-indigo-600 font-semibold' : ''
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

          {/* Mobile user info + logout */}
          <div className="flex items-center gap-3 border-t border-indigo-600 pt-4 mt-4">
            <img
              src={user?.photo || '/default-avatar.png'}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
            <div className="flex-1">
              <p className="font-semibold">{user?.name || 'User'}</p>
              <p className="text-sm truncate">{user?.email || 'No email'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-indigo-100 hover:text-white flex items-center gap-1"
              aria-label="Logout"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
