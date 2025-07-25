import multer from "multer";
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from "./Cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'revelo',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

export default upload;