import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Use useNavigate for React Router v6+

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // Use useNavigate hook for navigation in v6+

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribeAuth(); // Cleanup auth listener
    }, []);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const userCartRef = doc(db, "carts", user.uid);
                const cartSnapshot = await getDoc(userCartRef);

                if (cartSnapshot.exists()) {
                    const cartData = cartSnapshot.data();
                    const items = await Promise.all(cartData.items.map(async (item) => {
                        const bookSnapshot = await getDoc(item.book);  // Use the reference stored in the cart
                        if (bookSnapshot.exists()) {
                            return {
                                book: bookSnapshot.data(),
                                quantity: item.quantity,
                            };
                        } else {
                            return null; // Book not found
                        }
                    }));

                    setCartItems(items.filter(item => item !== null)); // Filter out books not found
                } else {
                    setCartItems([]); // Cart is empty
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cart items:", error);
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [user]);

    const handleProceedToOrder = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty! Please add items to proceed.");
            return;
        }

        // Navigate to the order page and pass cart items as state
        navigate("/user/order", { state: { cartItems } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2 text-left">Product</th>
                            <th className="border p-2 text-left">Price</th>
                            <th className="border p-2 text-left">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.book.title}>
                                <td className="border p-2">{item.book.title}</td>
                                <td className="border p-2">$ {item.book.price}</td>
                                <td className="border p-2">{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="mt-4">
                <button 
                    onClick={handleProceedToOrder} 
                    className="bg-blue-500 text-white px-4 py-2 rounded">
                    Proceed to Order
                </button>
            </div>
            <div className="mt-4">
                <button 
                    onClick={handleProceedToOrder} 
                    className="bg-red-500 text-white px-4 py-2 rounded">
                    Remove cart
                </button>
            </div>
        </div>
    );
};

export default CartPage;
