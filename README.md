# Combos & Casa Business Website

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)
![Handlebars](https://img.shields.io/badge/Handlebars-orange?style=for-the-badge&logo=handlebars)

**Premium Fitness, Fine Dining & Event Space Platform**

[Live Demo](#) | [Documentation](./docs/) | [Handover Guide](./PROJECT-HANDOVER.md) | [Development Guide](./DEVELOPMENT-GUIDE.md)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Email System](#email-system)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**Combos & Casa** is a comprehensive multi-business platform integrating three premium services under one unified web experience:

- **🏃 Fresh & Fit Gym** - Modern fitness center with membership management and Paystack payment integration
- **🍽️ Nankwaase Bar & Restaurant** - Full-featured restaurant with online ordering, menu management, and table reservations
- **🎉 Event Spaces** - Professional event venue booking system for weddings, corporate events, and celebrations

Built with Next.js 16 (App Router), TypeScript, and Supabase, this platform provides a seamless, production-ready solution for managing multiple business verticals with shared authentication, payments, and customer management.

---

## ✨ Features

### 🏃 Fresh & Fit Gym
- **Membership Plans** - Three tiers (Basic, Premium, VIP) with detailed pricing
- **Paystack Integration** - Secure payment processing with real-time verification
- **Membership Dashboard** - Track active memberships, start/end dates, and status
- **Database Persistence** - All memberships saved to Supabase
- **Email Notifications** - Automatic confirmation emails for new memberships
- **Responsive Design** - Fully optimized for mobile and desktop

### 🍽️ Nankwaase Bar & Restaurant
- **Dynamic Menu System** - Categorized menu (starters, mains, desserts, cocktails, wines, mocktails)
- **Shopping Cart** - Add/remove items, adjust quantities, persistent cart state
- **Online Ordering** - Complete checkout with pickup/delivery options
- **Table Reservations** - Real-time booking with date/time selection and guest count
- **Email Confirmations** - Customer and admin notifications for orders and reservations
- **About Page** - Restaurant story, services, gallery, opening hours
- **Menu Management** - Database-driven menu items with pricing and descriptions

### 🎉 Event Space
- **Event Type Selection** - Weddings, corporate events, birthdays, private parties
- **Booking System** - Complete booking flow with Supabase integration
- **Real-time Availability** - Check date/time availability before booking
- **Guest Management** - Handle guest counts and duration requirements
- **Special Requests** - Custom notes and special requirements handling
- **Email Notifications** - Confirmation emails for customers and admins
- **Booking Dashboard** - View all bookings and their status

### 👤 User Dashboard
- **Order History** - Track all restaurant orders with status updates
- **Active Memberships** - View gym membership details and renewal dates
- **Event Bookings** - Manage all event space reservations
- **Profile Management** - User information and preferences
- **Authentication** - Secure Supabase auth with protected routes

### 📧 Email System
- **Handlebars Templates** - 8 professional email templates (customer + admin)
- **Transactional Emails** - Orders, reservations, events, memberships
- **SMTP Integration** - Nodemailer with configurable SMTP provider
- **Non-blocking** - Email failures don't interrupt critical operations
- **Template Customization** - Easy-to-edit HBS files for email content
- **Gold Branding** - Professional design matching site theme

### 🎨 UI/UX
- **Modern Dark Theme** - Elegant dark design with gold accents (#D4AF37)
- **Smooth Animations** - Framer Motion for page transitions and interactions
- **Fully Responsive** - Mobile-first design approach
- **Accessibility** - WCAG compliant shadcn/ui components
- **Loading States** - Proper loading indicators throughout
- **Error Handling** - User-friendly error messages with toast notifications

### 🔐 Security & SEO
- **Environment Variables** - Proper secret management (see [SECURITY-GUIDE.md](docs/SECURITY-GUIDE.md))
- **Row Level Security** - Supabase RLS for data protection
- **Server-side Processing** - Sensitive operations in API routes
- **Complete Metadata** - Open Graph, Twitter Cards, JSON-LD schemas
- **Dynamic Sitemap** - Auto-generated XML sitemap at `/sitemap.xml`
- **PWA Support** - Installable progressive web app
- **Structured Data** - Rich snippets for search engines

---

## Tech Stack

### Core
- **[Next.js 16.1.6](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React 19](https://react.dev/)** - UI library

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **Custom Theme** - Gold (#D4AF37) and dark color scheme

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Server-side authentication
  - Real-time capabilities

### Payments
- **[Paystack](https://paystack.com/)** - Payment processing
  - Secure payment gateway
  - Verification API
  - Production-ready integration

### Email System
- **[Nodemailer](https://nodemailer.com/)** - SMTP email sending
- **[Handlebars](https://handlebarsjs.com/)** - Email template engine
  - 8 professional templates
  - Customer + admin notifications
  - Gold-branded HTML emails

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Radix UI primitives
  - Input, Textarea, Select
  - Tabs, RadioGroup, Label
  - Dialog, Button components

### Icons & Fonts
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Google Fonts](https://fonts.google.com/)** - Inter & Poppins

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[date-fns](https://date-fns.org/)** - Date manipulation

---

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **Supabase** account (for authentication & database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/combos-and-casa-business-website.git
   cd combos-and-casa-business-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_PROJECT_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # SEO & Analytics (Optional)
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   
   # Contact Information
   NEXT_PUBLIC_CONTACT_EMAIL=contact@yourdomain.com
   NEXT_PUBLIC_CONTACT_PHONE=+1-234-567-8900
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
combos-and-casa-business-website/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── sitemap.ts               # Dynamic sitemap
│   ├── cart/                    # Shopping cart
│   ├── checkout/                # Checkout flow
│   ├── contact/                 # Contact page
│   ├── dashboard/               # User dashboard
│   │   └── page.tsx
│   ├── event-space/             # Event booking
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── fresh&fit/               # Gym section
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── nankwaase-bar-and-restaurant/  # Restaurant
│       ├── layout.tsx
│       ├── about/
│       ├── menu/
│       └── reservations/
│
├── components/                   # React components
│   ├── Navbar.tsx               # Navigation
│   ├── Footer.tsx               # Footer
│   ├── StructuredData.tsx       # SEO schema
│   ├── ui/                      # shadcn/ui components
│   ├── home/                    # Home page components
│   ├── fitness/                 # Gym components
│   ├── restaurant/              # Restaurant components
│   ├── events/                  # Event components
│   └── dashboard/               # Dashboard components
│
├── lib/                         # Utility libraries
│   ├── utils.ts                 # Helper functions
│   ├── metadata.ts              # SEO metadata config
│   ├── structured-data.ts       # JSON-LD schemas
│   └── supabase/                # Supabase clients
│       ├── client.ts            # Browser client
│       └── server.ts            # Server client
│
├── public/                      # Static assets
│   ├── site.webmanifest         # PWA manifest
│   └── robots.txt               # Search engine rules
│
├── docs/                        # Documentation
│   ├── SEO-CONFIGURATION.md     # SEO guide
│   ├── SECURITY-GUIDE.md        # Security best practices
│   ├── PAYSTACK-SERVER-EXAMPLE.ts   # Server-side payment
│   └── PAYSTACK-CLIENT-EXAMPLE.tsx  # Client-side payment
│
└── package.json                 # Dependencies
```

---

## ⚙️ Configuration

### 🔒 Security Configuration (Important!)

**Protect your secret keys!** Environment variables with `NEXT_PUBLIC_` prefix are **exposed to the browser**.

**Safe to expose (use `NEXT_PUBLIC_`):**
- ✅ `NEXT_PUBLIC_SUPABASE_PROJECT_URL` - Public URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Protected by RLS
- ✅ `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - Public key
- ✅ `NEXT_PUBLIC_SITE_URL` - Website URL

**Must keep secret (NO `NEXT_PUBLIC_` prefix):**
- 🔒 `PAYSTACK_SECRET_KEY` - Use in API routes only
- 🔒 `DATABASE_URL` - Database connection
- 🔒 `SUPABASE_SERVICE_ROLE_KEY` - Admin access
- 🔒 Any API tokens, passwords, or secrets

📖 **Read the complete guide:** [docs/SECURITY-GUIDE.md](docs/SECURITY-GUIDE.md)

### SEO Configuration

All SEO settings are centralized in `lib/metadata.ts`. Key configurations:

- **Site-wide metadata** - Title templates, descriptions, keywords
- **Open Graph tags** - Social media sharing
- **Twitter Cards** - Twitter-specific metadata
- **Structured Data** - JSON-LD schemas for Google

See [docs/SEO-CONFIGURATION.md](docs/SEO-CONFIGURATION.md) for detailed documentation.

### Theme Customization

Primary colors are defined in `app/globals.css`:

```css
--gold: #D4AF37;
--background: #0A0A0A;
```

Custom utility classes:
- `.gradient-gold` - Gold gradient background
- `.text-gold` - Gold text color
- `.bg-gold` - Gold background
- `.border-gold` - Gold border
- `.hover-gold` - Gold hover effects

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Add to `.env.local`
4. Set up tables for:
   - Users
   - Orders
   - Memberships
   - Bookings
   - Menu Items

---

## 📧 Email System

This project includes a complete transactional email system built with **Nodemailer** and **Handlebars templates**.

### Setup
```bash
# Already installed
npm install nodemailer @types/nodemailer handlebars @types/handlebars
```

### Configuration
Add to `.env.local`:
```env
# SMTP Configuration (use your email provider)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_smtp_password_here
SMTP_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Templates Available
Located in `lib/email-templates/`:
- ✅ Customer order confirmation
- ✅ Admin order notification
- ✅ Customer reservation confirmation
- ✅ Admin reservation notification
- ✅ Customer event booking confirmation
- ✅ Admin event booking notification
- ✅ Customer membership activation
- ✅ Admin membership notification

### Integration Points
Emails are automatically sent when:
- Restaurant order is placed
- Table reservation is made
- Event space is booked
- Gym membership is purchased

**📖 Full documentation:** [docs/EMAIL-SYSTEM-README.md](./docs/EMAIL-SYSTEM-README.md)

---

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/combos-and-casa-business-website)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

This Next.js app can be deployed to:
- **Netlify**
- **AWS Amplify**
- **Digital Ocean**
- **Railway**
- Any platform supporting Node.js

### Environment Variables for Production

Make sure to set all required environment variables in your hosting platform:
- `NEXT_PUBLIC_SITE_URL` - Your production domain
- `NEXT_PUBLIC_SUPABASE_PROJECT_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

### Core Documentation
- **[PROJECT-HANDOVER.md](./PROJECT-HANDOVER.md)** - Complete project handover guide with architecture, database schemas, and API documentation
- **[DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)** - Developer setup guide and best practices

### Feature Documentation
- **[EMAIL-SYSTEM-README.md](./docs/EMAIL-SYSTEM-README.md)** - Email system implementation and customization
- **[EMAIL-INTEGRATION-GUIDE.md](./docs/EMAIL-INTEGRATION-GUIDE.md)** - How to integrate emails into new features
- **[SEO-CONFIGURATION.md](./docs/SEO-CONFIGURATION.md)** - SEO setup, metadata, and structured data

### Security & Best Practices
- **[SECURITY-GUIDE.md](./docs/SECURITY-GUIDE.md)** - Environment variables and secret management
- **[SECURITY-CHECKLIST.md](./docs/SECURITY-CHECKLIST.md)** - Pre-deployment security checklist

### Payment Integration
- **[PAYSTACK-SERVER-EXAMPLE.ts](./docs/PAYSTACK-SERVER-EXAMPLE.ts)** - Server-side payment verification
- **[PAYSTACK-CLIENT-EXAMPLE.txt](./docs/PAYSTACK-CLIENT-EXAMPLE.txt)** - Client-side payment integration

### Database Schemas
- **[FITNESS-SCHEMA.sql](./docs/FITNESS-SCHEMA.sql)** - Gym membership database schema
- **[EVENT-BOOKINGS-SCHEMA.sql](./docs/EVENT-BOOKINGS-SCHEMA.sql)** - Event booking database schema

---

## 🤝 Contributing

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly (run `npm run build` to check for errors)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Code Standards
- **TypeScript:** Use strict typing, avoid `any`
- **Components:** Follow the existing component structure
- **Styling:** Use Tailwind CSS utilities
- **Testing:** Test on multiple devices and browsers
- **Documentation:** Update docs for any new features

### Before Submitting
- [ ] Code builds without errors (`npm run build`)
- [ ] No TypeScript errors
- [ ] Tested on mobile and desktop
- [ ] Environment variables documented
- [ ] Security best practices followed

## 📋 Roadmap & Future Features

### Planned Features
- [ ] **Admin Dashboard** - Manage menu, orders, reservations, events, memberships
- [ ] **Real-time Notifications** - Live order status updates
- [ ] **Customer Reviews** - Rating system for restaurant and gym
- [ ] **Loyalty Program** - Points and rewards system
- [ ] **Analytics Dashboard** - Business insights and metrics
- [ ] **Multi-language Support** - i18n implementation
- [ ] **SMS Notifications** - Twilio integration
- [ ] **Calendar Integration** - Google Calendar sync for events
- [ ] **Inventory Management** - Stock tracking for restaurant

### Completed Features
- [x] Paystack payment integration
- [x] Email notification system
- [x] Restaurant online ordering
- [x] Table reservations system
- [x] Event booking system
- [x] Gym membership management
- [x] User dashboard
- [x] SEO optimization
- [x] PWA support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ℹ️ License and copyright notice required

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: yourname@example.com
- Portfolio: https://yourportfolio.com

---

## 🙏 Acknowledgments

Special thanks to:
- **[Next.js Team](https://nextjs.org/)** - The React Framework for Production
- **[Vercel](https://vercel.com/)** - Hosting and deployment platform
- **[Supabase](https://supabase.com/)** - Backend infrastructure and authentication
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible UI components
- **[Paystack](https://paystack.com/)** - Payment processing infrastructure
- **[Lucide](https://lucide.dev/)** - Icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Handlebars](https://handlebarsjs.com/)** - Email template engine

### Open Source Components Used
- React 19
- TypeScript 5
- Radix UI primitives
- date-fns
- clsx & tailwind-merge
- sonner (toast notifications)

---

## 🚀 Quick Start Guide

For new developers joining the project:

1. **Read the handover document:** [PROJECT-HANDOVER.md](./PROJECT-HANDOVER.md)
2. **Set up your environment:** [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)
3. **Understand security:** [docs/SECURITY-GUIDE.md](./docs/SECURITY-GUIDE.md)
4. **Start developing!**

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Built with ❤️ using Next.js 16, TypeScript, and modern web technologies

[Report Bug](https://github.com/yourusername/combos-and-casa-business-website/issues) · [Request Feature](https://github.com/yourusername/combos-and-casa-business-website/issues) · [View Demo](#)

---

**Last Updated:** February 2026

</div>
