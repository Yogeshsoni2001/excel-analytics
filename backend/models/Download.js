const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
  downloadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Download", downloadSchema);
