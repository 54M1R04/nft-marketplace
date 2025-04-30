import dbConnect from "../../lib/mongodb";
import User from "../../models/user";
import bcrypt from "bcrypt";
import { setCookie } from "nookies";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      await dbConnect();

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Set the user's email in a cookie
      setCookie({ res }, "userEmail", user.email, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/", // Cookie is accessible across the entire site
        httpOnly: true, // Prevent client-side access to the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      });

      // If login is successful, return a success response
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}