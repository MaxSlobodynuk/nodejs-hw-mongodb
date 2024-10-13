import multer from 'multer';
import crypto from "node:crypto"
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = crypto.randomUUID();
    cb(null, `${uniquePrefix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });