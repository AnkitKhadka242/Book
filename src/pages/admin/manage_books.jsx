import React, { useState, useEffect } from "react";
import DynamicTable from "../../components/table";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    quantity: 1,
    coverUrl: "",
    price: 0, // Added price field
  });
  const [selectedBook, setSelectedBook] = useState(null); // For editing and deleting
  const [addBookLoading, setAddBookLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const fetchedBooks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          author: doc.data().author,
          quantity: doc.data().quantity,
          cover: doc.data().cover,
          price: doc.data().price, // Added price field
        }));
        setBooks(fetchedBooks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (book) => {
    setSelectedBook(book); // Set selected book for editing
    setNewBook({
      title: book.title,
      author: book.author,
      quantity: book.quantity,
      coverUrl: book.cover,
      price: book.price, // Added price field
    });
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const addBook = async () => {
    setAddBookLoading(true);
    try {
      const bookData = {
        title: newBook.title,
        author: newBook.author,
        quantity: newBook.quantity,
        cover: newBook.coverUrl || "", // Storing the URL directly
        price: newBook.price, // Added price field
      };

      await addDoc(collection(db, "books"), bookData);

      closeModal();

      const querySnapshot = await getDocs(collection(db, "books"));
      const fetchedBooks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        author: doc.data().author,
        quantity: doc.data().quantity,
        cover: doc.data().cover,
      }));
      setBooks(fetchedBooks);

      setNewBook({ title: "", author: "", quantity: 1, coverUrl: "", price: 0 });
      setAddBookLoading(false);
    } catch (error) {
      console.error("Error adding book:", error);
      setAddBookLoading(false);
    }
  };

  const editBook = async () => {
    if (!selectedBook) return;

    setAddBookLoading(true);
    try {
      const bookRef = doc(db, "books", selectedBook.id);
      const updatedBookData = {
        title: newBook.title,
        author: newBook.author,
        quantity: newBook.quantity,
        cover: newBook.coverUrl || "", // Store the updated URL
        price: newBook.price, // Added price field
      };

      await updateDoc(bookRef, updatedBookData);
      setAddBookLoading(false);
      setBooks(books.map(book => book.id === selectedBook.id ? { ...book, ...updatedBookData } : book));
      closeEditModal();
    } catch (error) {
      console.error("Error updating book:", error);
      setAddBookLoading(false);
    }
  };

  const deleteBook = async () => {
    if (!selectedBook) return;

    setAddBookLoading(true);
    try {
      const bookRef = doc(db, "books", selectedBook.id);
      await deleteDoc(bookRef);
      setBooks(books.filter(book => book.id !== selectedBook.id));
      closeDeleteModal();
      setAddBookLoading(false);
    } catch (error) {
      console.error("Error deleting book:", error);
      setAddBookLoading(false);
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
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold mb-4">Manage Books</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={openModal}
        >
          Add Book
        </button>
      </div>
      <DynamicTable
        headings={["Title", "Author", "Quantity", "Cover", "Price", "Actions"]} // Added Price column
        data={books.map((book) => ({
          ...book,
          cover: book.cover ? (
            <img src={book.cover} alt="Cover" className="w-16 h-16 object-contain" />
          ) : (
            "No Image"
          ),
          price: `$${book.price}`, // Display price
          actions: (
            <div className="flex space-x-2">
              <button onClick={() => openEditModal(book)} className="bg-yellow-500 text-white p-2 rounded">Edit</button>
              <button onClick={() => openDeleteModal(book)} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
          )
        }))}
        hasAction={false}
      />

      {/* Add Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-1/2">
            <h2 className="text-lg font-semibold mb-4">Add New Book</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newBook.title}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={newBook.author}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={newBook.quantity}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="coverUrl"
              placeholder="Cover URL"
              value={newBook.coverUrl}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newBook.price}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${addBookLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={addBook}
                disabled={addBookLoading}
              >
                {addBookLoading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-1/2">
            <h2 className="text-lg font-semibold mb-4">Edit Book</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newBook.title}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={newBook.author}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={newBook.quantity}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="coverUrl"
              placeholder="Cover URL"
              value={newBook.coverUrl}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newBook.price}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${addBookLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={editBook}
                disabled={addBookLoading}
              >
                {addBookLoading ? 'Saving...' : 'Save Changes'}
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
            <p>Are you sure you want to delete this book?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${addBookLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={deleteBook}
                disabled={addBookLoading}
              >
                {addBookLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
