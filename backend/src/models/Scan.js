import mongoose from "mongoose";

const findingSchema = new mongoose.Schema(
  {
    type: { type: String },
    owasp: { type: String },
    severity: { type: String },
    description: { type: String },
    evidence: { type: mongoose.Schema.Types.Mixed }
  },
  { _id: false }
);


const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    target: {
      type: String,
      required: true
    },

    results: Object,
    findings: Array
  },
  { timestamps: true }
);

export default mongoose.model("Scan", scanSchema);
