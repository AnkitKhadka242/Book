import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Adjust the path as necessary
import { collection, getDocs } from "firebase/firestore";

const AdminDashboard = () => {
  const [orderStatusCounts, setOrderStatusCounts] = useState({});

  useEffect(() => {
    const fetchOrderStatusCounts = async () => {
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const statusCounts = {};

      ordersSnapshot.forEach((doc) => {
        const orderData = doc.data();
        const status = orderData.status;
        if (statusCounts[status]) {
          statusCounts[status]++;
        } else {
          statusCounts[status] = 1;
        }
      });

      setOrderStatusCounts(statusCounts);
    };

    fetchOrderStatusCounts();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div>
        {Object.entries(orderStatusCounts).map(([status, count]) => (
          <div key={status}>
            <strong>{status}:</strong> {count}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;