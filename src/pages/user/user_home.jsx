import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure you have react-router-dom installed
import { db } from "../../firebase"; // Ensure you have firebase configured
import { collection, getDocs } from "firebase/firestore";

const UserHome = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const booksCollection = collection(db, "books");
      const booksSnapshot = await getDocs(booksCollection);
      
      // Extract book data and include document ID
      const booksList = booksSnapshot.docs.map(doc => ({
        ...doc.data(), // Spread the data of the book
        id: doc.id, // Include the document ID
      }));

      setBooks(booksList);
    };

    fetchBooks();
  }, []);

  const handleCardClick = (bookId) => {
    navigate(`/user/book/${bookId}`);
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {books.map((book, index) => (
          <div 
            key={index} 
            className="bg-white p-4 rounded shadow-md cursor-pointer"
            onClick={() => handleCardClick(book.id)}
          >
            <img 
              src={book.cover || "default-image-url.jpg"} 
              alt={book.title} 
              className="w-full h-48 object-contain mb-4 rounded"
            />
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-700">{book.author}</p>
            <p className="text-gray-500">{book.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHome;
