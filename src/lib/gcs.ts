import type { Storage } from '@google-cloud/storage';

const bucketName = 'idlcloud';

/**
 * Initializes and returns a Google Cloud Storage client.
 */
async function getStorageClient(): Promise<Storage> {
  const { Storage } = await import('@google-cloud/storage');
  const credentialsEnv = process.env.GCS_CREDENTIALS;

  if (!credentialsEnv) {
    throw new Error("GCS_CREDENTIALS environment variable is not set.");
  }

  try {
    const credentials = JSON.parse(credentialsEnv);
    return new Storage({ credentials });
  } catch (error) {
    console.error("Failed to parse GCS credentials:", error);
    throw new Error("Invalid GCS_CREDENTIALS format. Ensure it's valid JSON.");
  }
}

/**
 * Uploads a file to Google Cloud Storage and returns its public URL.
 * NOTE: This function assumes the bucket has uniform bucket-level access enabled
 * and that the `allUsers` principal has the `Storage Object Viewer` role.
 */
export async function uploadFileToGCS(file: File, destination: string): Promise<string> {
  const storage = await getStorageClient();
  const bucket = storage.bucket(bucketName);
  const buffer = Buffer.from(await file.arrayBuffer());
  const blob = bucket.file(destination);

  try {
    await blob.save(buffer, {
      contentType: file.type,
      // The `predefinedAcl` option is not used with uniform bucket-level access.
      // Permissions are managed by IAM.
    });

    // Construct the public URL manually.
    return `https://storage.googleapis.com/${bucketName}/${destination}`;
  } catch (err) {
    console.error("Error uploading to GCS:", err);
    throw new Error(`Unable to upload file. Details: ${err}`);
  }
}

/**
 * Generates a signed URL for accessing a file in Google Cloud Storage.
 * This is used for files that are not publicly accessible by default.
 */
export async function getSignedUrl(filePath: string): Promise<string> {
  const storage = await getStorageClient();
  const bucket = storage.bucket(bucketName);

  // If the path is already a full GCS URL, extract the object name.
  const gcsUrlPrefix = `https://storage.googleapis.com/${bucketName}/`;
  if (filePath.startsWith(gcsUrlPrefix)) {
    filePath = filePath.substring(gcsUrlPrefix.length);
  }

  const options = {
    version: 'v4' as const,
    action: 'read' as const,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  try {
    const [url] = await bucket.file(filePath).getSignedUrl(options);
    return url;
  } catch (error) {
    console.error(`Error generating signed URL for '${filePath}':`, error);
    throw new Error(`Could not generate signed URL for '${filePath}'.`);
  }
}
