'use server';
import 'dotenv/config';
import { Storage } from '@google-cloud/storage';

const bucketName = 'idlcloud';

/**
 * Initializes and returns a Google Cloud Storage client.
 */
function getStorageClient(): Storage {
  const credentialsPath = process.env.GCS_CREDENTIALS;
  if (!credentialsPath) {
    throw new Error("GCS_CREDENTIALS environment variable is not set.");
  }

  return new Storage({
    keyFilename: credentialsPath,
  });
}

/**
 * Uploads a file to Google Cloud Storage and returns its public URL.
 */
export async function uploadFileToGCS(file: File, destination: string): Promise<string> {
  const storage = getStorageClient();
  const bucket = storage.bucket(bucketName);
  const buffer = Buffer.from(await file.arrayBuffer());
  const blob = bucket.file(destination);

  try {
    await blob.save(buffer, {
      contentType: file.type,
    });

    await blob.makePublic();
    return blob.publicUrl();
  } catch (err) {
    console.error("Error uploading to GCS:", err);
    throw new Error(`Unable to upload file. Details: ${err}`);
  }
}

/**
 * Generates a signed URL for accessing a file in Google Cloud Storage.
 */
export async function getSignedUrl(filePath: string): Promise<string> {
  const storage = getStorageClient();
  const bucket = storage.bucket(bucketName);

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
