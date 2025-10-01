import { v2 as cloudinary } from 'cloudinary';

// Configurazione Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  url: string;
  filename: string;
}

export async function uploadImageToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  try {
    // Converti il file in buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Genera un public_id sicuro
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const safePublicId = `${timestamp}_${randomId}`;
    
    // Upload su Cloudinary usando il buffer
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'segnalazioni-felipe',
          resource_type: 'auto',
          public_id: safePublicId,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    }) as any;

    return {
      url: result.secure_url,
      filename: file.name
    };
  } catch (error) {
    console.error('Errore upload Cloudinary:', error);
    throw new Error('Errore nel caricamento dell\'immagine');
  }
}

export async function uploadMultipleImages(
  files: File[]
): Promise<CloudinaryUploadResult[]> {
  try {
    const uploadPromises = files.map(file => uploadImageToCloudinary(file));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Errore upload multiplo:', error);
    throw new Error('Errore nel caricamento delle immagini');
  }
}
