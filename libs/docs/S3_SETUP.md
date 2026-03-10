# S3 Upload Configuration Guide

This application now uses AWS S3-compatible storage (AWS S3, DigitalOcean Spaces, MinIO, etc.) for file uploads instead of EdgeStorage.

## Environment Variables Setup

Add the following environment variables to your `.env` file:

```bash
# AWS S3 / DigitalOcean Spaces Configuration
S3_ENDPOINT_URL=your_endpoint_url_here
S3_ACCESS_KEY_ID=your_access_key_id_here
S3_SECRET_ACCESS_KEY=your_secret_access_key_here
S3_BUCKET_NAME=your_bucket_name_here
S3_REGION=auto
S3_CDN_URL=your_cdn_url_here
```

### Configuration Details

#### For AWS S3:
```bash
S3_ENDPOINT_URL=https://s3.amazonaws.com
S3_ACCESS_KEY_ID=your_aws_access_key_id
S3_SECRET_ACCESS_KEY=your_aws_secret_access_key
S3_BUCKET_NAME=your-bucket-name
S3_REGION=us-east-1  # or your preferred region
S3_CDN_URL=https://your-bucket-name.s3.amazonaws.com  # or CloudFront URL
```

#### For DigitalOcean Spaces:
```bash
S3_ENDPOINT_URL=https://nyc3.digitaloceanspaces.com  # or your region
S3_ACCESS_KEY_ID=your_spaces_access_key
S3_SECRET_ACCESS_KEY=your_spaces_secret_key
S3_BUCKET_NAME=your-space-name
S3_REGION=auto
S3_CDN_URL=https://your-space-name.nyc3.cdn.digitaloceanspaces.com
```

#### For MinIO or other S3-compatible storage:
```bash
S3_ENDPOINT_URL=https://your-minio-endpoint.com
S3_ACCESS_KEY_ID=your_minio_access_key
S3_SECRET_ACCESS_KEY=your_minio_secret_key
S3_BUCKET_NAME=your-bucket-name
S3_REGION=auto
S3_CDN_URL=https://your-minio-endpoint.com/your-bucket-name
```

## Bucket Configuration

### Required Bucket Settings:

1. **Public Access**: Files should be publicly readable
   - For AWS S3: Set bucket policy to allow public read access
   - For DigitalOcean Spaces: Enable "File Listing" in the Spaces settings

2. **CORS Configuration** (if accessing from browser):
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### Folder Structure:
The application will automatically create folders based on upload type:
- `document/` - For PDF and document files
- `images/` - For image files (if used)
- `videos/` - For video files (if used)

## File Upload Flow

1. User uploads a file through the application
2. File is processed (PDF watermarking if applicable)
3. File is uploaded to S3 with a unique filename: `{original-name}-{timestamp}.{extension}`
4. Public URL is returned and stored in the database
5. File is accessible via the CDN URL (if configured) or direct S3 URL

## File Deletion

When a post is deleted:
1. The application attempts to delete the file from S3
2. If deletion fails (file already deleted, permissions issue), it logs a warning but continues
3. The database record is removed

## Migration from EdgeStorage

The following changes were made:
1. ✅ Removed `@edgestore/react` and `@edgestore/server` packages
2. ✅ Installed `@aws-sdk/client-s3`
3. ✅ Created new S3 utility library (`libs/s3.js`)
4. ✅ Updated upload API route to use S3
5. ✅ Updated post deletion to use S3
6. ✅ Removed EdgeStoreProvider from layout
7. ✅ Removed EdgeStore API routes
8. ✅ Updated environment variables

## Testing

To test the upload functionality:
1. Ensure all S3 environment variables are set correctly
2. Create a test upload through the application
3. Verify the file appears in your S3 bucket
4. Verify the file is accessible via the returned URL
5. Test deletion by removing a post

## Troubleshooting

### Upload fails with "Access Denied"
- Check that your access key and secret key are correct
- Verify bucket permissions allow uploads
- Ensure the bucket exists

### Files upload but aren't accessible
- Check bucket public access settings
- Verify CORS configuration
- Check that ACL is set to 'public-read' in the upload function

### CDN URL not working
- Verify S3_CDN_URL is set correctly
- For DigitalOcean Spaces, ensure CDN is enabled
- For AWS S3, ensure CloudFront distribution is configured

## Security Notes

- Never commit your `.env` file to version control
- Use IAM roles with minimal required permissions
- Consider using signed URLs for sensitive content
- Regularly rotate access keys
- Monitor bucket access logs
