# Cloudinary Setup Guide for Calendly Clone

## Error: "cloud_name is disabled"

This error occurs when trying to use authenticated requests from the frontend. The solution is to use **Unsigned Uploads** with an upload preset, which is secure and doesn't require exposing API keys.

## Steps to Fix

### 1. Create an Unsigned Upload Preset in Cloudinary

1. Go to your Cloudinary Dashboard: https://cloudinary.com/console
2. Navigate to **Settings** → **Upload**
3. Look for "Upload presets" section and click **Add upload preset**
4. Configure:
   - **Name:** `unsigned_preset`
   - **Signing Mode:** `Unsigned`
   - **Folder:** `calendly_events` (optional, for organization)
5. Click **Save**

### 2. Update Your Code

The app is already configured to use:
- Cloud Name: `dbbrrigw0` (from your CLOUDINARY_URL)
- Upload Preset: `unsigned_preset` (configured in `/lib/cloudinary.js`)

### 3. Environment Setup (Optional)

You can also use environment variables if preferred:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbbrrigw0
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsigned_preset
```

Then update `/lib/cloudinary.js` to use these variables:

```javascript
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dbbrrigw0";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset";
```

## How It Works

1. **User selects a file** (image or document) from their device
2. **File is uploaded directly to Cloudinary** from the browser using the unsigned preset
3. **Cloudinary returns a secure URL** for the file
4. **URL is stored** in the PostgreSQL database as part of the event
5. **Files are served** via Cloudinary's CDN globally

## File Upload Limits

- **Images:** Max 5MB each (PNG, JPG, GIF, etc.)
- **Documents:** Max 10MB each (PDF, DOC, DOCX, XLS, PPT, etc.)
- **Max files per event:** Unlimited

## Features Provided

### Image Upload
- Drag & drop support
- File type validation
- Size validation
- Progress indicator
- Preview before submission
- Multiple images per event

### Document Upload
- Supports: PDF, Word (DOC, DOCX), Excel (XLS, XLSX), PowerPoint (PPT, PPTX), Text (TXT)
- Drag & drop support
- File type validation
- Size validation
- Progress indicator
- Multiple documents per event

## Troubleshooting

### "Upload failed"
- Check if the upload preset name is correct (case-sensitive)
- Verify the preset is set to "Unsigned"
- Check browser console for detailed error messages

### Images not displaying
- Verify the Cloudinary URL is correct
- Check if the image URL is HTTPS
- Ensure the file was successfully uploaded to Cloudinary

### Storage limits
- Free tier: 25 GB storage per month
- If you have large events, consider compressing images before upload

## Security Notes

- **Unsigned uploads are secure** because they cannot modify other users' files
- URL-based access can be further restricted using Cloudinary's access controls
- Sensitive documents should only be visible to invited attendees

## Cloudinary Free Tier Benefits

- 25 GB storage/month
- 25 GB bandwidth/month
- Image optimization and transformations
- Responsive image serving
- Global CDN

## Next Steps

1. Create the `unsigned_preset` in your Cloudinary dashboard
2. Restart your development server: `npm run dev`
3. Try creating an event with images and documents
4. Files should upload successfully to Cloudinary

## Support

For more information:
- Cloudinary Docs: https://cloudinary.com/documentation
- Unsigned Upload Guide: https://cloudinary.com/documentation/upload_presets
