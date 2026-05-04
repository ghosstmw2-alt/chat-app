import { useState } from "react";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        setError("");

        if (!email || !password) {
            return setError("All fields are required");
        }

        if (!email.includes("@")) {
            return setError("Invalid email");
        }

        if (password.length < 4) {
            return setError("Password must be at least 4 characters");
        }

        // fake auth (you can customize this)
        if (email === "test@mail.com" && password === "1234") {
            setUser(email);
        } else {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Chat Login</h2>

                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="error">{error}</p>}

                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}