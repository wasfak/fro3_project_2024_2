import mongoose, { Schema, model, models } from "mongoose";

const codeSchema = new mongoose.Schema({
  Code: { type: Number, required: true },
  ItemName: { type: String, required: true },
  Hokok: { type: Number, default: 0 },
  Khulfaa: { type: Number, default: 0 },
  Kolytadab: { type: Number, default: 0 },
  madenty: { type: Number, default: 0 },
  portSaid: { type: Number, default: 0 },
  semad: { type: Number, default: 0 },
  أول_الخلفاء: { type: Number, default: 0 },
  أركان: { type: Number, default: 0 },
  المحافظة: { type: Number, default: 0 },
  المستشفى_العام: { type: Number, default: 0 },
  صيدلية_بنك_مصر: { type: Number, default: 0 },
  صيدلية_السكة: { type: Number, default: 0 },
  صيدلية_الجيش: { type: Number, default: 0 },
  صيدلية_الجامعة: { type: Number, default: 0 },
  محمد_امين: { type: Number, default: 0 },
  صيدلية_شيراتون: { type: Number, default: 0 },
  صيدلية_دمياط: { type: Number, default: 0 },
  صيدلية_بور_سعيد: { type: Number, default: 0 },
  مخزن_الجلاء: { type: Number, default: 0 },
  مخزن_الجولف: { type: Number, default: 0 },
  مخزن_الدراسات: { type: Number, default: 0 },
  مخزن_الرحاب: { type: Number, default: 0 },
  مخزن_الزقازيق: { type: Number, default: 0 },
  مخزن_السكه: { type: Number, default: 0 },
  مخزن_السماد: { type: Number, default: 0 },
  مخزن_السويس: { type: Number, default: 0 },
  مخزن_المنزلة: { type: Number, default: 0 },
  مخزن_دمياط_الجديدة: { type: Number, default: 0 },
  مخزن_قناة_السويس: { type: Number, default: 0 },
  مدينة_نصر: { type: Number, default: 0 },
});

const CodeModel = models.Code || model("Code", codeSchema);

export default CodeModel;
