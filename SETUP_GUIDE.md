# Calendly Clone - Environment Setup Guide

## Cloudinary Setup (for Image & Document Uploads)

### Sign Up for Cloudinary
1. Go to https://cloudinary.com/users/register/free
2. Create a free account (includes 25 GB storage & bandwidth monthly)
3. After signing up, go to your Dashboard

### Get Your Credentials
1. In the Dashboard, find your **Cloud Name**
2. Create an **Upload Preset**:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Create unsigned upload preset"
   - Name it: `calendly_uploads`
   - Set "Mode" to "Unsigned"
   - Save

### Add to .env.local
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=calendly_uploads
```

### Verify Configuration
Test the upload by:
1. Creating a new event
2. Go to Step 4 (Media & Instructions)
3. Try uploading an image
4. If it fails, check the browser console for error messages

---

## Clerk OAuth Setup (Google Calendar)

### Configure Google OAuth Scope in Clerk
1. Go to https://dashboard.clerk.com
2. Navigate to: Social Connections → Google
3. In the "Scopes" field, add:
   ```
   https://www.googleapis.com/auth/calendar
   ```
4. Save changes

### Enable Google Calendar API
1. Go to https://console.cloud.google.com
2. Select your Clerk OAuth project
3. Search for "Google Calendar API"
4. Click "ENABLE"
5. Wait 2-3 minutes for changes to propagate

---

## Database Migration

After schema changes, run:
```bash
npx prisma db push
```

This updates:
- Event model: added `images`, `documents`, `notes`, `attendeeEmails`
- Booking model: added `invitedEmails`

---

## Testing the New Features

### Private Meeting Flow
1. Click "Create Event"
2. Select "Private Meeting"
3. Enter event details with suggestions
4. Add attendee emails (e.g., colleague@example.com)
5. Upload event images and documents
6. Add instructions/notes
7. Create event

### Attendee Experience
1. Share the booking link
2. Attendees see:
   - Event images
   - Reference documents
   - Notes/instructions
3. They book a time
4. Private event attendees auto-added to Google Calendar event

---

## File Size Limits

- Images: 5 MB max
- Documents: 10 MB max
- Supported: PNG, JPG, GIF, PDF, DOC, DOCX, PPT, XLS

---

## Troubleshooting

### "Failed to upload image"
- Check Cloudinary credentials in .env.local
- Verify upload preset exists and is "Unsigned"
- Check browser console for detailed error

### "Event creator has not connected Google Calendar"
- Organizer needs to go to Availability page
- Click "Connect Google Calendar"
- Grant all permissions

### "Google Calendar API has not been used"
- Enable API in Google Cloud Console
- Wait 2-3 minutes
- Force reconnect organizer's Google account

### Date/time fields not showing properly
- Ensure database migration ran: `npx prisma db push`
- Run `npx prisma generate` to regenerate client

---

## Free Services Used

✅ **Cloudinary** - File uploads (25 GB free/month)
✅ **Neon PostgreSQL** - Database
✅ **Clerk** - Authentication & OAuth
✅ **Google Calendar** - Meeting creation
✅ **Vercel/Next.js** - Hosting

**Total Cost: $0/month** (within free tier limits)
