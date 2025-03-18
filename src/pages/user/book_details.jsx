import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../../firebase"; // Import auth from firebase.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth method to check user state

const BookDetails = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [user, setUser] = useState(null); // State for holding user info

    // Use onAuthStateChanged to check the current user state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Set user to the state when authentication state changes
        });

        // Cleanup the listener when the component is unmounted
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchBook = async () => {
            if (!bookId) {
                console.error("No book ID provided");
                return;
            }

            const bookDoc = doc(db, "books", bookId);
            const bookSnapshot = await getDoc(bookDoc);

            if (bookSnapshot.exists()) {
                setBook(bookSnapshot.data());
            } else {
                console.error("No such book found!");
            }
        };

        fetchBook();
    }, [bookId]);

    const addToCart = async () => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }
    
        try {
            const userCartRef = doc(db, "carts", user.uid);
            const cartSnapshot = await getDoc(userCartRef);
    
            if (cartSnapshot.exists()) {
                const cartData = cartSnapshot.data();
                const updatedItems = [...cartData.items, { book: doc(db, "books", bookId), quantity: 1 }];
    
                await updateDoc(userCartRef, {
                    items: updatedItems,
                });
                alert("Book added to cart!");
            } else {
                const newCart = {
                    userId: user.uid, // Correctly set userId
                    items: [{ book: doc(db, "books", bookId), quantity: 1 }],
                };
    
                await setDoc(userCartRef, newCart);
                alert("Cart created and book added!");
            }
        } catch (error) {
            console.error("Error adding book to cart:", error);
            alert("Failed to add the book to the cart.");
        }
    };

    if (!book) {
        return <div className="text-center text-gray-700 text-xl">Loading...</div>;
    }

    return (
        <div className="flex flex-col py-8">
            <div className="bg-white p-6 rounded  w-full max-w-3xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Image Section */}
                    <div className="w-full md:w-2/3">
                        <img
                            src={book.cover || "default-image-url.jpg"}
                            alt={book.title}
                            className="w-full h-auto object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Book Details Section */}
                    <div className="w-full md:w-2/3">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">{book.author}</h2>
                        <h2 className="text-xl font-light text-gray-700 mb-4">$ {book.price}</h2>
                        <p className="text-gray-600 mb-4">{book.description}</p>


                        {/* Add to Cart Button */}
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={addToCart}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
