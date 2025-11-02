import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiHome, FiBarChart2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { clearAuth, isAuthenticated } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-semibold text-sky-600">
          UrlShorten
        </Link>
        <Link
          to="/dashboard"
          className="text-sm text-gray-600 hover:text-sky-600 flex items-center gap-1"
        >
          <FiHome /> Dashboard
        </Link>
        
      </div>
      <div className="flex items-center gap-3">
        {isAuthenticated() ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            <FiLogOut /> Logout
          </button>
        ) : (
          <Link
              to="/login"
              className="px-3 py-1 rounded-md bg-white text-sky-600 border border-sky-600 hover:bg-sky-50">
              Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;