// backend/routes/fileRoutes.js
const express = require('express');
const {
  upload,
  uploadExcel,
  getAllData,
  getDataById,
  deleteDataById,
  backfillOriginalFileName,
} = require('../controllers/fileController');


const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// POST: Upload and parse Excel file
router.post('/upload', protect, upload.single('excel'), uploadExcel);

// GET: Get all parsed data
router.get('/all', protect, getAllData);

// GET: Get data by ID
router.get('/:id', protect, getDataById);

// DELETE: Delete data by ID
router.delete('/:id', protect, deleteDataById);

router.get('/backfill-original-name', protect, backfillOriginalFileName);



module.exports = router;
