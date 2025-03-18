import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth, signOut } from "../../firebase";

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Sign out from Firebase
            await signOut(auth);

            // Redirect to login page or home page after logout
            navigate("/auth"); // Adjust to your login route
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
                <nav>
                    <Link to="/admin/" className="block py-2 px-3 hover:bg-gray-700">
                        Dashboard
                    </Link>
                    <Link to="/admin/books" className="block py-2 px-3 hover:bg-gray-700">
                        Manage Books
                    </Link>
                    <Link to="/admin/orders" className="block py-2 px-3 hover:bg-gray-700">
                        Manage Orders
                    </Link>
                </nav>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="block py-2 px-3 bg-red-600 hover:bg-red-700 mt-4 text-white rounded"
                >
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4">
                <Outlet /> {/* Render nested routes here */}
            </main>
        </div>
    );
};

export default AdminLayout;