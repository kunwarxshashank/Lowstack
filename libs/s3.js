import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client with your credentials
const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT_URL,
    region: process.env.S3_REGION || 'auto', // Use 'auto' for DigitalOcean Spaces or your specific region
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: false, // Set to true if using MinIO or similar
});

/**
 * Upload a file to S3-compatible storage
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - The name of the file
 * @param {string} contentType - The MIME type of the file
 * @param {string} folder - The folder/prefix in the bucket (e.g., 'document', 'images')
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export async function uploadToS3(fileBuffer, fileName, contentType, folder = 'document') {
    const bucketName = process.env.S3_BUCKET_NAME;
    const key = `${folder}/${fileName}`;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: 'public-read', // Make the file publicly accessible
    });

    try {
        await s3Client.send(command);

        // Construct the public URL
        // If you have a CDN endpoint, use that, otherwise construct from endpoint
        const cdnUrl = process.env.S3_CDN_URL;
        if (cdnUrl) {
            return `${cdnUrl}/${key}`;
        }

        // Fallback to direct S3 URL
        const endpoint = process.env.S3_ENDPOINT_URL;
        return `${endpoint}/${bucketName}/${key}`;
    } catch (error) {
        console.error('S3 upload error:', error);
        throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
}

/**
 * Delete a file from S3-compatible storage
 * @param {string} fileUrl - The full URL of the file to delete
 * @returns {Promise<boolean>} - True if deletion was successful
 */
export async function deleteFromS3(fileUrl) {
    try {
        const bucketName = process.env.S3_BUCKET_NAME;

        // Extract the key from the URL
        let key;
        if (fileUrl.includes(bucketName)) {
            // Extract key from full S3 URL
            const urlParts = fileUrl.split(`${bucketName}/`);
            key = urlParts[1];
        } else {
            // Extract key from CDN URL
            const cdnUrl = process.env.S3_CDN_URL;
            if (cdnUrl && fileUrl.startsWith(cdnUrl)) {
                key = fileUrl.replace(`${cdnUrl}/`, '');
            } else {
                console.warn('Could not extract S3 key from URL:', fileUrl);
                return false;
            }
        }

        const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await s3Client.send(command);
        return true;
    } catch (error) {
        console.error('S3 deletion error:', error);
        return false;
    }
}

export { s3Client };
