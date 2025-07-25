import axios from "axios";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "institute_uploads");

  const response = await axios.post(
    "https://api.cloudinary.com/v1_1/ddo15zw7d/upload", 
    formData
  );

  return response.data.secure_url; 
};
