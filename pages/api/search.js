import db from "@/db";
import CodeModel from "@/models/codeModel";

export default async function handler(req, res) {
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

    const foundCode = await CodeModel.findOne({ Code: searchCode });

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
