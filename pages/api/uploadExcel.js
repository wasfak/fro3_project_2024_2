import db from "@/db";
import uploadMiddleware from "../../multerMiddleware";
import xlsx from "xlsx";
import CodeModel from "@/models/codeModel";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await db.connectDb();

    // Use the Multer middleware to handle file upload
    uploadMiddleware(req, res, async function (err) {
      if (err) {
        console.error("File upload failed:", err);
        return res.status(500).json({ error: "File upload failed" });
      }

      // Access the file data from req.file.buffer
      const fileBuffer = req.file.buffer;

      // Parse Excel file
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Check if the sheet is empty
      const data = xlsx.utils.sheet_to_json(sheet);
      if (data.length === 0) {
        return res.status(400).json({ error: "Empty Excel file" });
      }

      // Check if the required columns are present
      const requiredColumns = ["Code"];
      const sheetColumnsLowerCase = Object.keys(data[0]).map((column) =>
        column.toLowerCase()
      );
      const missingColumns = requiredColumns.filter(
        (column) => !sheetColumnsLowerCase.includes(column.toLowerCase())
      );

      if (missingColumns.length > 0) {
        return res.status(400).json({
          error: `Missing required columns: ${missingColumns.join(", ")}`,
        });
      }

      try {
        // Use insertMany for batch insertion with parallelism
        await CodeModel.deleteMany();
        const batchSize = 1000; // Adjust the batch size as needed
        const promises = [];

        // Parallelize insertion using Promise.all
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          promises.push(CodeModel.insertMany(batch));
        }

        await Promise.all(promises);
      } catch (insertError) {
        console.error("Error inserting data into MongoDB:", insertError);
        return res
          .status(500)
          .json({ error: "Error inserting data into MongoDB" });
      }

      return res.status(200).json({ message: "File uploaded successfully!" });
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await db.disconnectDb();
  }
}
