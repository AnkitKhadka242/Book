import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPasswordHandler, signInWithEmailAndPasswordHandler } from "../firebase";

const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleAuth = async () => {
        setError(""); // Reset error message
        try {
            if (isRegister) {
                // Registration logic
                await createUserWithEmailAndPasswordHandler(email, password);
                navigate("/user"); // Redirect to user dashboard after successful registration
            } else {
                // Login logic
                const { user, role } = await signInWithEmailAndPasswordHandler(email, password);
                console.log(role);
                // Check if the user is admin or user
                if (role === "admin") {
                    console.log("Admin");
                    localStorage.setItem("role", "admin");
                    navigate("/admin/");
                } else {
                    console.log("User");
                    localStorage.setItem("role", "user");
                    navigate("/user/");
                }
            }
        } catch (err) {
            setError(err.message); // Show error message if login/registration fails
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {isRegister ? "Register" : "Login"}
                </h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-2 border rounded"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-2 border rounded"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleAuth}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    {isRegister ? "Sign Up" : "Login"}
                </button>

                <p
                    className="text-sm text-center mt-2 cursor-pointer text-blue-600"
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
