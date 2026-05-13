import { config } from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });
const { BACKEND_PORT } = process.env;

const uploadsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../backend/uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const app = express();

app.post('/api/submit', upload.single('file'), (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  return res.json({
    ...req.body,
    filePath: req.file ? `uploads/${req.file.filename}` : null,
  });
});

app.listen(BACKEND_PORT, () => console.log(`Server running on port ${BACKEND_PORT}`));

export default app;
