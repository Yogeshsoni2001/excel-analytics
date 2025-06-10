// backend/controllers/fileController.js
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const ParsedData = require('../models/ParsedData');


// Multer config to store uploaded Excel files
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Upload and parse Excel file
const uploadExcel = async (req, res) => {
  try {
    
    const filePath = path.join(__dirname, '..', req.file.path);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const saved = await ParsedData.create({
      data,
      uploadedBy: req.user._id, 
      originalFileName: req.file.originalname,
    });

    // Delete file after parsing
     

    res.status(200).json({ message: 'File uploaded and data saved', saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process file', details: err.message });
  }
};

// Get all parsed data
const getAllData = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await ParsedData.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Get single file data by ID
const getDataById = async (req, res) => {
  try {
    const fileId = req.params.id;
    const data = await ParsedData.findById(fileId);
    if (!data) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch file', details: err.message });
  }
};

// Delete a file by ID
const deleteDataById = async (req, res) => {
  try {
    const id = req.params.id;
    await ParsedData.findByIdAndDelete(id);
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file', details: err.message });
  }
};

const backfillOriginalFileName = async (req, res) => {
  try {
    const files = await ParsedData.find({ originalFileName: { $exists: false } });

    for (const file of files) {
      file.originalFileName = `File Uploaded ${new Date(file.createdAt).toLocaleString()}`;
      await file.save();
    }

    res.status(200).json({ message: `${files.length} files updated.` });
  } catch (error) {
    console.error('Backfill error:', error);
    res.status(500).json({ error: 'Backfill failed' });
  }
};

module.exports = {
  upload,
  uploadExcel,
  getAllData,
  getDataById,
  deleteDataById,
  backfillOriginalFileName,
};
