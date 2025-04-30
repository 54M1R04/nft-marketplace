import dbConnect from "../../lib/mongodb";
import User from "../../models/user";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query; // Replace `userId` with your unique identifier

    try {
      await dbConnect();

      // Query the database for the user with the given userId
      const user = await User.findOne({ userId }); // Replace `userId` with your unique field

      if (user) {
        res.status(200).json({ email: user.email }); // Return the user's email
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