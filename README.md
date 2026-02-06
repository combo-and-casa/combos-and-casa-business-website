# Combos & Casa Business Website

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)

**Premium Fitness, Fine Dining & Event Space**

[Live Demo](#) | [Documentation](#) | [Report Bug](#) | [Request Feature](#)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## About

**Combos & Casa** is a comprehensive business platform combining three premium lifestyle services:

- **🏃 Fresh & Fit Gym** - State-of-the-art fitness center with membership management
- **🍽️ Nankwaase Bar & Restaurant** - Fine dining with online ordering and reservations
- **🎉 Event Spaces** - Elegant venues for weddings, corporate events, and celebrations

Built with modern web technologies, this platform provides a seamless user experience across all services with integrated booking, ordering, and membership management systems.

---

## Features

### Fresh & Fit Gym
- Interactive membership plans with pricing
- Membership purchase flow
- User dashboard for tracking memberships
- Responsive fitness content sections

### Nankwaase Bar & Restaurant
- **Dynamic Menu System** - Browse categorized menu items (starters, mains, desserts, cocktails, wines)
- **Shopping Cart** - Add items, adjust quantities, remove items
- **Online Ordering** - Complete checkout with pickup/delivery options
- **Table Reservations** - Book tables online with date/time selection
- **About Page** - Restaurant story, services, gallery, opening hours

### Event Space
- Event type selection (weddings, corporate, birthdays, private parties)
- Real-time availability checking
- Guest count and duration management
- Special requests handling
- Booking confirmation system

### User Dashboard
- Order history with status tracking
- Active memberships management
- Event bookings overview
- User profile information

### Authentication (Supabase)
- Secure user authentication
- Server-side session management
- Protected routes for authenticated users

### UI/UX
- **Modern Design** - Dark theme with gold accents (#D4AF37)
- **Smooth Animations** - Framer Motion for page transitions
- **Fully Responsive** - Mobile-first design approach
- **Accessibility** - WCAG compliant components

### SEO & Performance
- **Complete Metadata** - Open Graph, Twitter Cards
- **Structured Data** - JSON-LD schemas for all business types
- **Dynamic Sitemap** - Auto-generated XML sitemap
- **PWA Support** - Installable web app
- **Optimized Images** - Next.js Image component
- **Fast Loading** - Server components where possible

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
  - Authentication
  - PostgreSQL database
  - Row Level Security (RLS)

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
   NEXT_PUBLIC_CONTACT_EMAIL= your-contact-email 
   NEXT_PUBLIC_CONTACT_PHONE= your-phone-number
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
│   └── SEO-CONFIGURATION.md     # SEO guide
│
└── package.json                 # Dependencies
```

---

## ⚙️ Configuration

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

## 🗺️ Roadmap

- [ ] Payment integration (Stripe/Paystack)
- [ ] Email notifications (Resend/SendGrid)
- [ ] Admin dashboard
- [ ] Real-time order tracking
- [ ] Customer reviews & ratings
- [ ] Loyalty program


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Your Name**
- GitHub: [@yourusername](https://github.com/eunie-alswell)
- Email: eunicealswelltech@gmail.com

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Hosting platform
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icon library

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ using Next.js and TypeScript

</div>
