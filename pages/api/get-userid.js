import dbConnect from "../../lib/mongodb";
import User from "../../models/user";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { email } = req.query; // Replace `email` with the unique identifier you have

    try {
      await dbConnect();

      // Query the database for the user with the given email
      const user = await User.findOne({ email }); // Replace `email` with your unique field

      if (user) {
        res.status(200).json({ userId: user.userId }); // Return the user's userId
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Database error", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}