import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data from backend if already logged in
        fetch("http://localhost:5000/user", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.username) {
                    setUser(data);
                }
            });
    }, []);

    const handleLogin = async () => {
        // Simulate a login (In real case, call API)
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            credentials: "include",
        });
        const data = await response.json();
        setUser(data);
    };

    const handleLogout = async () => {
        await fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    };

    return (
        <nav className="flex justify-between p-4 bg-gray-800 text-white">
            <h1 className="text-xl font-bold">Gym Management</h1>
            <div>
                {!user ? (
                    <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 rounded-lg">
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
