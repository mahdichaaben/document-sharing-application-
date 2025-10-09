import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserIcon from "@assets/icons/UserIcon";
export default function ProfileDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // Logic for signing out
    // await auth.signOut();
    // navigate("/auth/login");
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-moon-dark hover:text-moon-blue"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <UserIcon className="w-4" />
        <span className="ml-2">Account</span>
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg transition-transform transform scale-95 origin-top-right">
          <Link
            to="/notifications"
            className="block px-4 py-2 text-sm text-moon-dark hover:bg-gray-200"
            onClick={() => setDropdownOpen(false)}
          >
            Notifications
          </Link>
          <button
            className="block px-4 py-2 text-sm text-moon-dark hover:bg-gray-200 w-full text-left"
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
