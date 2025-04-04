import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Navbar Component
function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
        navigate("/"); // Redirect to Home after logout
    };

    return (
        <nav className="flex justify-between p-4 bg-gray-800 text-white">
            <h1 className="text-xl font-bold">Gym Management</h1>
            <div>
                {!user ? (
                    <button onClick={() => navigate("/login")} className="px-4 py-2 bg-blue-500 rounded-lg">
                        Login
                    </button>
                ) : (
                    <div className="flex items-center space-x-4">
                        <span>Welcome, {user.username}</span>
                        <Link to="/profile">Profile</Link>
                        <Link to="/supplements">Supplements</Link>
                        <Link to="/memberships">Memberships</Link>
                        <button onClick={handleLogout} className="px-3 py-1 bg-red-500 rounded-lg">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

// Home Page Component
function Home({ user }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h2 className="text-3xl font-bold">Welcome to the Gym Management System</h2>
            {user && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-xl">User Profile</h3>
                    <p><strong>Username:</strong> {user.username}</p>
                </div>
            )}
        </div>
    );
}

// Login Page Component
function Login({ setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (data.username) {
            setUser(data);
            navigate("/"); // Redirect to Home after successful login
        } else {
            alert("Invalid credentials!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h2 className="text-2xl mb-4">Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col space-y-3">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 bg-gray-800 rounded-lg"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 bg-gray-800 rounded-lg"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 rounded-lg">
                    Login
                </button>
            </form>
        </div>
    );
}

// Main App Component (Without Router)
function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/user", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data.username) {
                    setUser(data);
                }
            });
    }, []);

    return (
        <>
            <Navbar user={user} setUser={setUser} />
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
            </Routes>
        </>
    );
}

export default App;
