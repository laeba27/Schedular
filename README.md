# Full Stack Calendly Clone with Next JS, React, Tailwind CSS, Prisma, Neon, Clerk, Shadcn UI Tutorial 🔥🔥
## https://youtu.be/glAC7d-TYSM



### Make sure to create a `.env` file with following variables -

```
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
# 📅 Schedular - Calendly Clone

A modern, feature-rich scheduling application built with **Next.js 14**, **PostgreSQL**, **Clerk Authentication**, and **Google Calendar Integration**. Create events, manage availability, and book meetings with ease.

![Next.js](https://img.shields.io/badge/Next.js-14.2.7-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-336791?style=flat-square&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?style=flat-square&logo=tailwind-css)

## 🌟 Features

### Core Functionality
- ✅ **Multi-Step Event Creation** - Create private and public events with smart templates
- ✅ **Google Calendar Integration** - Sync bookings directly to Google Calendar with Meet links
- ✅ **Private Events** - Invite specific attendees via email
- ✅ **Event Media Management** - Upload images and documents to Cloudinary
- ✅ **Availability Management** - Set your availability schedule per weekday
- ✅ **Booking System** - Attendees can book available time slots
- ✅ **Meeting Links** - Automatic Google Meet generation for every booking
- ✅ **Share Functionality** - Share events on WhatsApp, Email, Twitter, LinkedIn, Facebook

### Advanced Features
- 🎨 **Beautiful UI** - Responsive design with Tailwind CSS and custom components
- 🔐 **Authentication** - Secure sign-in/up with Clerk
- 📊 **Dashboard Analytics** - View upcoming meetings, statistics, and calendar widget
- 🎯 **Event Templates** - Pre-configured templates: 1-on-1, Product Demo, Consultation, Team Sync, Interview, Training
- 📝 **Event Notes** - Add instructions and notes for attendees
- 📎 **Reference Documents** - Attach PDFs and documents to events
- 🖼️ **Event Images** - Professional event presentation with images
- 🔔 **Real-time Updates** - Dynamic meeting lists and notifications
- 📱 **Mobile Responsive** - Works seamlessly on all devices

## 📋 Requirements

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **PostgreSQL** database (Neon recommended for free PostgreSQL)
- **Clerk Account** for authentication
- **Google Cloud Project** for Calendar API
- **Cloudinary Account** for file uploads

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/laeba27/Schedular.git
cd Schedular
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://[username]:[password]@[host]:[port]/[database]?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Cloudinary File Upload
CLOUDINARY_URL=cloudinary://[api_key]:[api_secret]@[cloud_name]
```

#### Getting the Required Credentials

##### PostgreSQL (Neon)
1. Visit [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project
4. Copy the connection string
5. Paste into `DATABASE_URL`

##### Clerk Authentication
1. Visit [clerk.com](https://clerk.com)
2. Create a new application
3. Go to API Keys → Copy both keys
4. Add Google OAuth provider (Social Connections → Google)
5. Add calendar scope: `https://www.googleapis.com/auth/calendar`

##### Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or use Clerk's project
3. Enable **Google Calendar API**
4. Create OAuth 2.0 credentials
5. Wait 2-3 minutes for API propagation

##### Cloudinary
1. Visit [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard → Settings → API Keys
4. Copy your `CLOUDINARY_URL`
5. Create unsigned upload preset for file uploads

### 4. Database Setup

Run Prisma migrations to set up the database:

```bash
npx prisma migrate dev --name init
# or push schema directly
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
calendly-clone/
├── app/
│   ├── api/
│   │   └── upload/                 # Cloudinary file upload API
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (main)/
│   │   ├── dashboard/              # Main dashboard
│   │   ├── availability/           # Availability management
│   │   ├── events/                 # Event listing
│   │   ├── meetings/               # Meetings view
│   │   └── _components/            # Shared components
│   ├── [username]/
│   │   └── [eventId]/              # Public booking page
│   ├── layout.js                   # Root layout
│   ├── page.jsx                    # Home page
│   └── globals.css                 # Global styles
├── actions/                        # Server actions
│   ├── events.js
│   ├── bookings.js
│   ├── meetings.js
│   ├── availability.js
│   ├── users.js
│   └── dashboard.js
├── components/                     # Reusable components
│   ├── create-event-multistep.jsx
│   ├── event-card.jsx
│   ├── event-form.jsx
│   ├── header.jsx
│   ├── user-menu.jsx
│   └── ui/                         # UI primitives
├── hooks/                          # Custom React hooks
│   └── use-fetch.js
├── lib/                            # Utilities
│   ├── cloudinary.js               # File upload utilities
│   ├── prisma.js                   # Prisma client
│   ├── checkUser.js                # User verification
│   ├── utils.js
│   └── validators.js               # Zod schemas
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
├── public/                         # Static assets
├── .env                            # Environment variables
├── middleware.js                   # Clerk middleware
├── next.config.mjs                 # Next.js config
├── tailwind.config.js              # Tailwind config
├── tsconfig.json                   # TypeScript config
└── package.json

```
## 🔌 API Routes

### File Upload
```
POST /api/upload
- Uploads files to Cloudinary
- Accepts: images, documents
- Size limits: 5MB (images), 50MB (documents)
```

## 🔐 Authentication Flow

1. User signs up/signs in via Clerk
2. User profile created in PostgreSQL
3. User can optionally connect Google Calendar via Clerk's OAuth
4. Google scopes required: `calendar`, `calendar.write`

## 📱 Key Pages

### `/` - Home Page
Landing page with sign-in/sign-up options

### `/dashboard` - Main Dashboard
- View upcoming meetings
- Check statistics (upcoming bookings, past meetings)
- See calendar widget
- Share booking links on social media

### `/events` - Event Management
- Create new events with multi-step form
- View all created events
- Edit, duplicate, or delete events
- Share events with copy/social links

### `/availability` - Schedule Management
- Set availability for each day of the week
- Set minimum gap between bookings
- Connect Google Calendar

### `/meetings` - Meetings List
- View upcoming meetings
- View past meetings
- Cancel upcoming bookings
- Join Google Meet directly

### `/:username/:eventId` - Public Booking Page
- View event details
- See images and documents
- Read notes and instructions
- Select available time slots
- Complete booking with Google Meet link

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, custom components |
| **Icons** | Lucide React |
| **Database** | PostgreSQL (Neon), Prisma ORM |
| **Authentication** | Clerk |
| **Calendar** | Google Calendar API |
| **File Storage** | Cloudinary |
| **Validation** | Zod, React Hook Form |
| **Date Handling** | date-fns |
| **Deployment Ready** | Vercel |

## 📦 Dependencies

### Core Dependencies
- `next@14.2.7` - React framework
- `react@18` - UI library
- `@prisma/client` - Database ORM
- `@clerk/nextjs` - Authentication
- `cloudinary` - File upload service

### UI & Styling
- `tailwindcss@3` - CSS framework
- `lucide-react` - Icons
- `next/image` - Optimized images

### Forms & Validation
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@hookform/resolvers` - Zod integration

### Date & Time
- `date-fns` - Date manipulation

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Click Deploy

```bash
git push origin main
```

### Environment Variables for Production
```env
DATABASE_URL=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
CLOUDINARY_URL=...
```

## 🐛 Troubleshooting

### "Google Calendar API not enabled"
- Visit [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
- Search for "Google Calendar API"
- Click ENABLE
- Wait 2-3 minutes for propagation

### "Organizer needs to re-authorize"
- Go to Availability page
- Click "Disconnect Google Calendar"
- Reconnect and grant all permissions
- Ensure Clerk has calendar scope configured

### "Cloudinary upload fails"
- Check `CLOUDINARY_URL` format in `.env`
- Ensure API key and secret are correct
- Verify cloud_name matches your Cloudinary account
- Check file size limits

### "Database connection error"
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- For Neon: verify IP whitelist settings
- Run `npx prisma db push` to sync schema

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Calendar API](https://developers.google.com/calendar)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Laeba Firdous** - [GitHub](https://github.com/laeba27)

## 📞 Support

For support, email support@schedular.com or open an issue on GitHub.

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [Google Calendar API](https://developers.google.com/calendar) for calendar integration
- [Cloudinary](https://cloudinary.com) for file storage
- [Neon](https://neon.tech) for PostgreSQL hosting
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide Icons](https://lucide.dev) for beautiful icons

---

**Made with ❤️ by Laeba Firdous**

Give a ⭐ if you like this project!

