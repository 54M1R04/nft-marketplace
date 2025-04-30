import { useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "nookies"; // Import nookies to set cookies

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // Use Next.js router for redirection

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Login successful!");

        // Set a cookie with the token
        setCookie(null, "token", data.token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/", // Cookie is accessible throughout the site
        });

        // Set a cookie with the user's email
        setCookie(null, "userEmail", email, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/", // Cookie is accessible throughout the site
        });

        // Redirect to the index page after successful login
        router.push("/");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to log in");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("An error occurred while logging in");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded w-full mb-4"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded w-full"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}

      {/* Register Button */}
      <div className="mt-4">
        <p className="text-sm text-gray-600">Don't have an account?</p>
        <button
          onClick={() => router.push("/register")} // Redirect to the register page
          className="mt-2 bg-gray-200 text-gray-800 p-2 rounded w-full hover:bg-gray-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;