# 🎬 Ranjith – Premium Creative Portfolio & Admin Suite

> **World-Class Creative Portfolio for a Professional Video Editor & Graphic Designer.**  
> Crafted with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **MongoDB / Resilient Local JSON Storage Engine**, and **Cloudinary**.

---

## 🌟 Visual Identity & Design Direction
- **Theme:** Cinematic Dark Agency
- **Backgrounds:** Deep Black (`#050507`), Charcoal (`#0d0d14`), Card Glass (`#13131d/80`)
- **Primary Accent:** Electric Purple (`#a855f7`, `#9333ea`) with glowing diffusion
- **Secondary Accent:** Neon Orange (`#ff6b00`, `#f97316`) for hyper-focused CTAs
- **Interactive UI:** Smooth Framer Motion transitions, custom desktop glowing cursor, interactive video player modal (YouTube/Vimeo/MP4), responsive image lightbox with zoom, and dynamic filter tabs.

---

## 🚀 Key Features

### 🖥️ Public Creative Showcase
1. **Cinematic Hero:**
   - Creative greeting pill with active status indicator ("Available for Projects & Retainers").
   - Bold typographical personal name & professional title.
   - Core tagline: *"Turning Ideas Into High-Impact Visual Experiences."*
   - Interactive showreel video card with ambient glowing ring and one-click play modal.
   - Floating credentials badges (*Video Editing*, *Graphic Design*, *Motion Graphics*, *5+ Years Experience*).
2. **About Me & Creative Journey:**
   - Visual storyteller narrative & personal philosophy quote.
   - Numerical achievement meters (*Years Exp, 260+ Projects, 85+ Happy Clients, 98% Retention*).
   - Interactive timeline of milestones from 2019 to Present.
   - Core superpowers grid with custom check indicators.
3. **Video Portfolio:**
   - Category filtering: *All*, *Commercials*, *Reels & Shorts*, *Cinematic*, *YouTube*, *Motion Graphics*.
   - Embedded video preview modal with zero redirection.
   - Tags for client, software used, duration, and organic view counts.
4. **Graphic Design Gallery:**
   - Responsive grid/masonry display.
   - Category filtering: *All*, *Logo & Branding*, *Posters & Print*, *Thumbnails*, *Social Media*, *Advertising*, *Creative Artwork*.
   - Full-screen high-resolution lightbox with zoom and metadata inspection.
5. **Services & Packages:**
   - 6 comprehensive offerings: *Cinematic Video Editing*, *Reels & Shorts Viral Editing*, *Motion Graphics*, *Brand Identity*, *Social Media Creatives*, *High-CTR Thumbnails*.
   - Deliverables checklist and direct project inquiry hook.
6. **Technical Skills & Tools:**
   - Interactive mastery meters: *Adobe Premiere Pro (95%)*, *After Effects (90%)*, *Photoshop (96%)*, *Illustrator (88%)*, *DaVinci Resolve (85%)*, *Canva Pro (92%)*, *Sound Design (87%)*, *Blender 3D (72%)*.
7. **Work Experience & Milestones:**
   - Career timeline across media studios and creator agencies.
8. **Client Testimonials:**
   - 5-star ratings, client avatars, roles, and project references.
9. **Interactive Contact & Fast Booking:**
   - Verified direct channels: WhatsApp direct chat, Email, Phone, Instagram, YouTube, LinkedIn, Behance.
   - Contact form with service selection, budget slider, validation, and celebration confetti.

---

## 🛡️ Admin Dashboard (`/admin`)

A secure, private administration portal built with the same cinematic dark agency styling.

### 🔐 Default Admin Credentials
- **URL:** `http://localhost:3000/admin/login`
- **Email:** `admin@ranjithportfolio.com`
- **Password:** `Admin@2026!`

### 🎛️ Admin Management Modules
| Module | Path | Description |
|---|---|---|
| **Dashboard Overview** | `/admin` | Summary metrics, active storage mode, quick launchpad, latest inquiries. |
| **Hero & Identity** | `/admin/hero` | Name, title, tagline, bio, profile image, showreel URL, CTAs, and badges. |
| **About Management** | `/admin/about` | Story paragraphs, quote, numerical statistics, and career journey steps. |
| **Video Projects** | `/admin/videos` | Full CRUD - Add, edit, delete, thumbnail upload, category, software tags, featured toggle. |
| **Graphic Design** | `/admin/designs` | Full CRUD - Add, edit, delete, artwork upload, aspect ratio, client, tools. |
| **Services** | `/admin/services` | Full CRUD - Add, edit, delete services, deliverables checklist, popular badge. |
| **Skills & Tools** | `/admin/skills` | Full CRUD - Add, edit, delete software skills, proficiency sliders (0-100%). |
| **Experience** | `/admin/experience` | Full CRUD - Career timeline, company, duration, role, achievements. |
| **Testimonials** | `/admin/testimonials` | Full CRUD - Client feedback, avatar upload, rating stars, project reference. |
| **Client Inquiries** | `/admin/enquiries` | View leads, filter (Unread/Read/Replied), update status, one-click email/WhatsApp response, delete. |
| **Website & SEO** | `/admin/settings` | Site title, SEO description, keywords, email, phone, WhatsApp, and social media URLs. |

---

## 💾 Dual Storage Engine (MongoDB + Resilient Local Disk Store)

The project includes an intelligent dual-storage abstraction:
1. **MongoDB Atlas / Local MongoDB:** When `MONGODB_URI` is provided in `.env.local`, the application connects and persists all entities through Mongoose schemas.
2. **Resilient Local JSON Engine:** If `MONGODB_URI` is empty or MongoDB is temporarily unreachable, the application automatically uses disk storage at `data/portfolio-db.json`.
   - **Zero configuration required to run immediately.**
   - All admin edits, creations, and deletions are saved permanently.
   - Does **not** rely on browser `localStorage`.

---

## ☁️ Media Uploads (Cloudinary + Local Storage Fallback)

Media uploads (`/api/upload`) support:
1. **Cloudinary:** If `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are provided in `.env.local`, uploads are saved directly to Cloudinary.
2. **Local File Storage:** If Cloudinary keys are omitted, uploads are saved locally into `public/uploads/` and served directly.

---

## 🛠️ Getting Started

### 1. Installation
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables (`.env.local`)
Configure `.env.local` (a ready template is provided):
\`\`\`env
# Optional MongoDB Connection
MONGODB_URI=

# Admin Authentication
JWT_SECRET=super_secret_creative_portfolio_jwt_key_ranjith_2026_xyz
ADMIN_EMAIL=admin@ranjithportfolio.com
ADMIN_PASSWORD=Admin@2026!

# Optional Cloudinary Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Public Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 3. Build & Run
\`\`\`bash
# Build production bundle
npm run build

# Start production server
npm run start
# Server will be running at http://localhost:3000
\`\`\`
