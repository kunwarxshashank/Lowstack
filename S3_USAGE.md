# S3 Upload Usage Example

## How the Upload System Works

The application now uses AWS S3-compatible storage for all file uploads. Here's how it works:

## Upload Flow

### 1. Client-Side Upload (Frontend)

The frontend sends files to the `/api/upload` endpoint using FormData:

```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('userId', userId);
formData.append('uploadType', 'document'); // or 'images', 'videos', etc.

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result.fileUrl contains the public S3 URL
// result.filename contains the unique filename
```

### 2. Server-Side Processing (Backend)

The `/api/upload` route:
1. Validates the file (type, size)
2. Generates a unique filename with timestamp
3. Processes PDFs (adds watermark, intro page, clickable headers)
4. Uploads to S3 using the `uploadToS3` function
5. Returns the public CDN URL

### 3. File Storage Structure

Files are organized in S3 by upload type:
```
lowstack/
├── document/
│   ├── notes-1738350000000.pdf
│   ├── assignment-1738350001000.pdf
│   └── ...
├── images/
│   └── ...
└── videos/
    └── ...
```

## Using the S3 Utility Functions

### Upload a File

```javascript
import { uploadToS3 } from '@/libs/s3';

// Upload a file buffer
const fileUrl = await uploadToS3(
  fileBuffer,      // Buffer containing file data
  'myfile.pdf',    // Filename
  'application/pdf', // MIME type
  'document'       // Folder/category
);

console.log('File uploaded to:', fileUrl);
// Output: https://lowstack.sfo3.cdn.digitaloceanspaces.com/document/myfile.pdf
```

### Delete a File

```javascript
import { deleteFromS3 } from '@/libs/s3';

// Delete using the full URL
const success = await deleteFromS3(
  'https://lowstack.sfo3.cdn.digitaloceanspaces.com/document/myfile.pdf'
);

if (success) {
  console.log('File deleted successfully');
}
```

## Environment Configuration

The S3 client is configured using environment variables:

```bash
S3_ENDPOINT_URL=https://lowstack.sfo3.digitaloceanspaces.com
S3_ACCESS_KEY_ID=DO801P7GEGJR62CXN9VW
S3_SECRET_ACCESS_KEY=g2qg3epCRvRAByhVLddhLiOAIB9fVywk+V0vKWhOT0E
S3_BUCKET_NAME=lowstack
S3_REGION=sfo3
S3_CDN_URL=https://lowstack.sfo3.cdn.digitaloceanspaces.com
```

## File Access

All uploaded files are publicly accessible via their CDN URL:
- **Direct Access**: `https://lowstack.sfo3.cdn.digitaloceanspaces.com/document/filename.pdf`
- **Fast Delivery**: Files are served via DigitalOcean's CDN
- **No Authentication Required**: Files have `public-read` ACL

## API Response Format

### Successful Upload
```json
{
  "success": true,
  "fileUrl": "https://lowstack.sfo3.cdn.digitaloceanspaces.com/document/notes-1738350000000.pdf",
  "filename": "notes-1738350000000.pdf"
}
```

### Upload Error
```json
{
  "error": "File too large",
  "status": 400
}
```

## Supported File Types

Currently supported:
- `application/pdf` - PDF documents
- `application/msword` - Word documents (.doc)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` - Word documents (.docx)
- `application/vnd.openxmlformats-officedocument.presentationml.presentation` - PowerPoint presentations (.pptx)

Maximum file size: **500 MB**

## PDF Processing Features

When uploading PDFs, the system automatically:
1. **Adds an intro page** with Lowstack branding
2. **Adds clickable headers** on each page linking to lowstack.in
3. **Preserves existing annotations** (links, comments, etc.)
4. **Adds watermark** if configured in `PDF_WATERMARK` env variable

## Error Handling

The upload system handles various error scenarios:

```javascript
try {
  const fileUrl = await uploadToS3(buffer, filename, contentType, folder);
  // Success
} catch (error) {
  console.error('Upload failed:', error.message);
  // Handle error - could be:
  // - Invalid credentials
  // - Network error
  // - Bucket permissions issue
  // - File too large
}
```

## Best Practices

1. **Always validate files** before uploading
2. **Use unique filenames** (timestamp-based naming is implemented)
3. **Set appropriate content types** for proper browser handling
4. **Handle upload errors gracefully** with user-friendly messages
5. **Clean up failed uploads** if needed
6. **Monitor S3 usage** to manage costs

## Migration Notes

- Old uploads in the local `/uploads` folder are **not automatically migrated**
- New uploads go directly to S3
- Old file URLs pointing to `/uploads/*` will continue to work if files exist locally
- Consider migrating old files to S3 for consistency

## Troubleshooting

### Upload fails with "Access Denied"
- Check S3 credentials in `.env`
- Verify bucket permissions allow uploads
- Ensure IAM user has `s3:PutObject` permission

### Files upload but aren't accessible
- Check bucket is set to public read
- Verify CDN URL is correct
- Check CORS configuration if accessing from browser

### Slow uploads
- Consider using multipart upload for large files
- Check network connection
- Verify S3 region is optimal for your location
