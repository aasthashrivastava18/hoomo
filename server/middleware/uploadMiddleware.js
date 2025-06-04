const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create subdirectories based on file type
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'productImage') {
      uploadPath += 'products/';
    } else if (file.fieldname === 'clothesImage' || file.fieldname === 'clothesImages') {
      uploadPath += 'clothes/';
    } else if (file.fieldname === 'restaurantImage' || file.fieldname === 'menuItemImage') {
      uploadPath += 'restaurants/';
    } else if (file.fieldname === 'profileImage') {
      uploadPath += 'profiles/';
    } else if (file.fieldname === 'reviewImage' || file.fieldname === 'reviewImages') {
      uploadPath += 'reviews/';
    } else {
      uploadPath += 'others/';
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.fieldname === 'productImage' || 
      file.fieldname === 'clothesImage' || 
      file.fieldname === 'clothesImages' ||
      file.fieldname === 'restaurantImage' ||
      file.fieldname === 'menuItemImage' ||
      file.fieldname === 'profileImage' ||
      file.fieldname === 'reviewImage' ||
      file.fieldname === 'reviewImages') {
    
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    
  } else if (file.fieldname === 'document') {
    // For documents, accept PDF, DOC, DOCX
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
      return cb(new Error('Only PDF and Word documents are allowed!'), false);
    }
  }
  
  // Accept the file
  cb(null, true);
};

// Create upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

// Single file upload middleware
exports.uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

// Multiple files upload middleware
exports.uploadMultiple = (fieldName, maxCount) => {
  return upload.array(fieldName, maxCount || 5);
};

// Multiple fields upload middleware
exports.uploadFields = (fields) => {
  return upload.fields(fields);
};

// Error handler middleware for upload errors
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    // An unknown error occurred
    return res.status(500).json({ message: err.message });
  }
  
  // No error
  next();
};

// Clean up uploaded files on error
exports.cleanupOnError = (req, res, next) => {
  const originalEnd = res.end;
  const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [];
  
  if (req.file) {
    files.push(req.file);
  }
  
  res.end = function (chunk, encoding) {
    // If response is an error (status >= 400), delete uploaded files
    if (res.statusCode >= 400 && files.length > 0) {
      files.forEach(file => {
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};
