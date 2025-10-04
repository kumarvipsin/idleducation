// src/app/actions/content.ts
'use server';
import 'dotenv/config';
import { db } from "@/lib/firebase";
import { getSignedUrl } from '@/lib/gcs';

// ==================================
// View PDF Action
// ==================================
export async function getSignedUrlForPdf(publicUrl: string) {
    if (!publicUrl) {
        return { success: false, message: 'No file URL provided.' };
    }
    try {
        const bucketName = process.env.GCS_BUCKET_NAME || 'idlcloud';
        const filePath = decodeURIComponent(publicUrl.substring(publicUrl.indexOf(bucketName) + bucketName.length + 1));
        const url = await getSignedUrl(filePath);
        return { success: true, url: url };
    } catch (error) {
        console.error("Error generating signed URL for PDF:", error);
        return { success: false, message: 'Could not get viewable link for the PDF.' };
    }
}
