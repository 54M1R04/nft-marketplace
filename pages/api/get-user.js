import dbConnect from "../../lib/mongodb";
import User from "../../models/user";
import { parseCookies } from "nookies"; // Import nookies to parse cookies

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Parse the cookies from the request
      const cookies = parseCookies({ req });
      const userEmail = cookies.userEmail;

      if (!userEmail) {
        return res.status(401).json({ message: "Unauthorized: No user email found in cookies" });
      }

      await dbConnect();

      // Find the user in the database by email
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return the user's data (e.g., avatarUrl)
      res.status(200).json({ avatarUrl: user.avatarUrl });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}