'use server';
import { Storage } from '@google-cloud/storage';

const bucketName = 'idlcloud';

let storage: Storage;

try {
  const credentials = JSON.parse(process.env.GCS_CREDENTIALS || '{}');
  if (!credentials.project_id) {
    throw new Error('GCS credentials are not set or invalid.');
  }
  storage = new Storage({
    projectId: credentials.project_id,
    credentials,
  });
} catch (error) {
  console.error("Failed to initialize Google Cloud Storage:", error);
  // Fallback or error handling if credentials are not available
  // For now, we'll let it throw, so it's clear configuration is needed.
  throw new Error("Could not initialize Google Cloud Storage. Please check your GCS_CREDENTIALS environment variable.");
}


const bucket = storage.bucket(bucketName);

export async function uploadFileToGCS(file: File, destination: string): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());

    const blob = bucket.file(destination);
    const blobStream = blob.createWriteStream({
        resumable: false,
    });

    return new Promise((resolve, reject) => {
        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
            resolve(publicUrl);
        })
        .on('error', (err) => {
            reject(`Unable to upload image, something went wrong: ${err}`);
        })
        .end(buffer);
    });
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
