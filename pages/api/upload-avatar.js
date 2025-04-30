import fs from "fs";
import path from "path";
import dbConnect from "../../lib/mongodb";
import User from "../../models/user";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const busboy = require("busboy");
    const bb = busboy({ headers: req.headers });

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let avatarUrl = "";
    let email = "";

    bb.on("field", (fieldname, value) => {
      if (fieldname === "email") {
        email = value;
      }
    });

    bb.on("file", (fieldname, file, info) => {
      const saveTo = path.join(uploadDir, info.filename);
      file.pipe(fs.createWriteStream(saveTo));
      avatarUrl = `/uploads/${info.filename}`;
    });

    bb.on("close", async () => {
      try {
        console.log("Email:", email);
        console.log("Avatar URL:", avatarUrl);

        await dbConnect();

        const user = await User.findOneAndUpdate(
          { email },
          { avatarUrl },
          { new: true, upsert: true }
        );

        console.log("Updated user:", user);
        res.status(200).json({ avatarUrl, user });
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error", error });
      }
    });

    bb.on("error", (error) => {
      console.error("Busboy error:", error);
      res.status(500).json({ message: "File upload error", error });
    });

    req.pipe(bb);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}