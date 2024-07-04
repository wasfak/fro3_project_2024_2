import db from "@/db";
import uploadMiddleware from "../../multerMiddleware";
import xlsx from "xlsx";
import CodeModel from "@/models/codeModel";

export const config = {
  api: {
    bodyParser: false,
  },
};

const columnMapping = {
  code: "code",
  name: "name",
  stock: "stock",
  company: "company",
  Elzaafran: "Elzaafran",
  Hokok: "Hokok",
  Khulfaa: "Khulfaa",
  Kolytadab: "Kolytadab",
  madenty: "madenty",
  portSaid: "portSaid",
  semad: "semad",
  zagazig: "zagazig",
  arkhan: "arkhan",
  awel_khulfa: "awel_khulfa",
  awel_march: "awel_march",
  ismailia: "ismailia",
  gala2: "gala2",
  gomhorya: "gomhorya",
  golf: "golf",
  drasat: "drasat",
  rehab: "rehab",
  swees: "swees",
  mohafza: "mohafza",
  m_aam: "m_aam",
  manzala: "manzala",
  new_domyat: "new_domyat",
  estad: "estad",
  gamaa: "gamaa",
  geesh: "geesh",
  seka: "seka",
  bank_masr: "bank_masr",
  porsaid_st: "porsaid_st",
  domyat: "domyat",
  sheraton: "sheraton",
  kanat_swees: "kanat_swees",
  m_nasr: "m_nasr",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await db.connectDb();

    uploadMiddleware(req, res, async function (err) {
      if (err) {
        console.error("File upload failed:", err);
        return res.status(500).json({ error: "File upload failed" });
      }

      const fileBuffer = req.file.buffer;
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const data = xlsx.utils.sheet_to_json(sheet);
      if (data.length === 0) {
        return res.status(400).json({ error: "Empty Excel file" });
      }

      const requiredColumns = ["code"];
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

      const mappedData = data.map((row) => {
        const mappedRow = {};
        for (const [key, value] of Object.entries(row)) {
          const mappedKey = columnMapping[key];
          if (mappedKey) {
            mappedRow[mappedKey] = value;
          }
        }
        return mappedRow;
      });

      try {
        await CodeModel.deleteMany();
        await CodeModel.insertMany(mappedData);
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
