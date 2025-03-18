import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", localStorage.getItem("uid")));
      const userData = userDoc.data();
      setUser(userData);
    };

    const fetchUserOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const orderData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderData.filter((order) => order.uid === localStorage.getItem("uid")));
    };

    fetchUserData();
    fetchUserOrders();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold">My Profile</h2>

      <div className="w-full max-w-md mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              onClick={() => setActiveTab(0)}
            >
              My Profile
            </button>
            <button
              className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              onClick={() => setActiveTab(1)}
            >
              My Orders
            </button>
          </nav>
        </div>

        <div className="mt-4">
          {activeTab === 0 && (
            <form className="flex flex-col">
              <label className="block mb-2">
                <span className="text-gray-700">Name:</span>
                <input
                  type="text"
                  value={user.name}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  readOnly
                />
              </label>

              <label className="block mb-2">
                <span className="text-gray-700">Email:</span>
                <input
                  type="email"
                  value={user.email}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  readOnly
                />
              </label>

              <label className="block mb-2">
                <span className="text-gray-700">Phone:</span>
                <input
                  type="text"
                  value={user.phone}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  readOnly
                />
              </label>
            </form>
          )}

          {activeTab === 1 && (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Book Title</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.bookTitle}</td>
                    <td>{order.quantity}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

