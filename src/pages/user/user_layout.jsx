import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../firebase"; // Import Firebase auth instance
import { signOut } from "firebase/auth"; // Import signOut function

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Amazon Forest Books</h1>
          <nav className="flex space-x-4">
            <Link to="/user/" className="text-lg font-semibold hover:underline">
              Home
            </Link>
            <Link to="/user/cart" className="text-lg font-semibold hover:underline">
              Cart
            </Link>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-lg font-semibold hover:underline"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
