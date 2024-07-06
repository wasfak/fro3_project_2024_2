import db from "@/db";
import CodeModel from "@/models/codeModel";
import Cors from "cors";

// Initialize the cors middleware
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
  origin: "*", // Adjust this according to your needs, e.g., specific domain: 'https://example.com'
});

// Helper method to wait for middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run the cors middleware
  await runMiddleware(req, res, cors);

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const body = req.body;
    const code = body.code;

    if (!code) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    await db.connectDb();
    const searchCode = Number(code);

    const foundCode = await CodeModel.findOne({ code: searchCode });

    if (!foundCode) {
      return res.status(404).json({ message: "Code not found" });
    }

    // Return a response with the found code and the global count
    return res.status(200).json({ foundCode });
  } catch (error) {
    console.error("Error searching for code:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await db.disconnectDb();
  }
}
