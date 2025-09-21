
'use server';
import { Storage } from '@google-cloud/storage';

const bucketName = 'idlcloud';

let storage: Storage;

try {
  // Explicitly point to the credentials file from the environment variable.
  // This is a more robust method for ensuring the correct credentials are used.
  storage = new Storage({
    keyFilename: process.env.GCS_CREDENTIALS,
  });
} catch (error) {
  console.error("Failed to initialize Google Cloud Storage:", error);
  throw new Error("Could not initialize Google Cloud Storage. Please ensure your GCS_CREDENTIALS environment variable is set correctly.");
}

const bucket = storage.bucket(bucketName);

export async function uploadFileToGCS(file: File, destination: string): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = bucket.file(destination);

    try {
        await blob.save(buffer, {
            contentType: file.type,
        });
        // Make the file publicly accessible
        await blob.makePublic();
        return blob.publicUrl();
    } catch (err) {
        console.error("Error uploading to GCS:", err);
        throw new Error(`Unable to upload image, something went wrong: ${err}`);
    }
}


export async function getSignedUrl(filePath: string): Promise<string> {
  const options = {
    version: 'v4' as const,
    action: 'read' as const,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  try {
    const [url] = await bucket.file(filePath).getSignedUrl(options);
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Could not generate signed URL.');
  }
}
