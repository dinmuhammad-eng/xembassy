const express = require('express');
const connection = require('../connection');
const router = express.Router();
const multer = require('multer');
const path = require('path');
let auth = require('../services/authentication');
let checkRole = require('../services/checkrole');
const fs = require('fs');

const moment = require('moment');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = file.fieldname === 'image' ? 'C:/Users/Din Muhammad/Desktop/images/' : 'C:/Users/Din Muhammad/Desktop/docs/';  // Update the path to your desired folders
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let extension = '';
    if (file.fieldname === 'image') {
      extension = path.extname(file.originalname);
    } else if (file.fieldname === 'docx' || file.fieldname === 'pdf') {
      extension = '.docx'; // Set the default extension to .docx
      if (file.mimetype === 'application/pdf') {
        extension = '.pdf'; // If the file is a PDF, update the extension to .pdf
      }
    }
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});
const upload = multer({ storage: storage });

router.use(express.json());

router.post('/add', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'docx', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), (req, res) => {
  const imageFile = req.files['image'] ? req.files['image'][0] : null;
  const docxFile = req.files['docx'] ? req.files['docx'][0] : null;
  const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;

  if (!imageFile || (!docxFile && !pdfFile)) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const baseUrl = 'http://your-server-base-url/'; // Update the URL to match your server's base URL
  const imagePath = imageFile.filename;
  const imageFullUrl = baseUrl + 'images/' + imagePath;
  
  let docxPath = '';
  let docxFullUrl = '';
  if (docxFile) {
    docxPath = docxFile.filename;
    docxFullUrl = baseUrl + 'docs/' + docxPath;
  }
  
  let pdfPath = '';
  let pdfFullUrl = '';
  if (pdfFile) {
    pdfPath = pdfFile.filename;
    pdfFullUrl = baseUrl + 'docs/' + pdfPath;
  }

  const occupation = req.body.occupation;
  const employeer = req.body.employeer;
  const employeerAddrees = req.body.employeerAddrees;
  const previousEmplyeer = req.body.previousEmplyeer;
  const previousEmplyeerAddress = req.body.previousEmplyeerAddress;
  const passportType = req.body.passportType;
  const jobTitle = req.body.jobTitle;
  const havePassport = req.body.havePassport;
  const previousPassport = req.body.previousPassport;
  const issueDate = req.body.issueDate;
  const expiryDate = req.body.expiryDate;
  const haveCriminal = req.body.haveCriminal;
  const passportDetails = req.body.passportDetails;
  const userId = req.body.userId;
  const categoryId = req.body.categoryId;

  const sql = 'INSERT INTO files (path, docxFullUrl, occupation, employeer, employeerAddrees, previousEmplyeer, previousEmplyeerAddress,  passportType, jobTitle, havePassport, previousPassport, issueDate, expiryDate, haveCriminal, passportDetails, userId, categoryId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

  connection.query(sql, [imageFullUrl, docxFullUrl, occupation, employeer, employeerAddrees, previousEmplyeer, previousEmplyeerAddress, passportType, jobTitle, havePassport, previousPassport, issueDate, expiryDate, haveCriminal, passportDetails, userId, categoryId], (err, result) => {
    if (err) {
      console.error('Error inserting file into database:', err);
      res.status(500).json({ error: 'Failed to store file reference' });
      return;
    }

    res.status(200).json({ message: 'Files uploaded successfully' });
  });
});

module.exports = router;
