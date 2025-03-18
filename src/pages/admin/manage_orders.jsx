import React, { useState, useEffect } from "react";
import DynamicTable from "../../components/table";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const fetchedOrders = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            status: data.status || "pending"
          };
        });
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => setIsViewModalOpen(false);

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    setUpdateLoading(true);
    try {
      const orderRef = doc(db, "orders", selectedOrder.id);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(order => order.id === selectedOrder.id ? { ...order, status: newStatus } : order));
      setUpdateLoading(false);
      closeEditModal();
    } catch (error) {
      console.error("Error updating order status:", error);
      setUpdateLoading(false);
    }
  };

  const deleteOrder = async () => {
    if (!selectedOrder) return;

    setUpdateLoading(true);
    try {
      const orderRef = doc(db, "orders", selectedOrder.id);
      await deleteDoc(orderRef);
      setOrders(orders.filter(order => order.id !== selectedOrder.id));
      setUpdateLoading(false);
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting order:", error);
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
      <DynamicTable
        headings={["Name", "Phone", "Address", "Status", "Total", "Actions"]}
        data={orders.map((order) => ({
          ...order,
          actions: (
            <div className="flex space-x-2">
              <button onClick={() => openViewModal(order)} className="bg-blue-500 text-white p-2 rounded">View</button>
              <button onClick={() => openEditModal(order)} className="bg-yellow-500 text-white p-2 rounded">Edit</button>
              <button onClick={() => openDeleteModal(order)} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
          )
        }))}
        hasAction={false}
      />

      {/* Edit Order Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-1/2">
            <h2 className="text-lg font-semibold mb-4">Edit Order Status</h2>
            <select
              value={newStatus}
              onChange={handleStatusChange}
              className="border p-2 mb-2 w-full"
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={updateOrderStatus}
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this order?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={deleteOrder}
                disabled={updateLoading}
              >
                {updateLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-1/2">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <ul>
              {selectedOrder.items.map((item, index) => (
                console.log(item),
                <li key={index} className="mb-2">
                  {item.title} - {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={closeViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;