const mongoose = require('mongoose');

const parsedDataSchema = new mongoose.Schema(
  {
    data: {
      type: Array,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ParsedData', parsedDataSchema);
