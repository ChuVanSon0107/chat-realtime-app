import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    
    cb(null, filename);
  }
});

export const upload = multer({
  storage,
  limits: {fileSize: 2 * 1024 * 1024}, //2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ cho phép upload ảnh"));
    }

    cb(null, true);
  }
});
