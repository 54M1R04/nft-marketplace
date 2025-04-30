import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link"; // Import Link for navigation

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // Use Next.js router for redirection

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);

        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push("/login");
        }, 2000); // Redirect after 2 seconds
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to register");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("An error occurred while registering");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister}>
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
          Register
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}

      {/* Add a link to the login page */}
      <p className="mt-4 text-sm text-gray-600 text-center">
        Already a member?{" "}
        <Link href="/login">
          <a className="text-indigo-600 hover:underline">Log in</a>
        </Link>
      </p>
    </div>
  );
};

export default Register;