# SEO & Metadata Configuration

This document explains the SEO and metadata setup for the Combos & Casa website.

## Files Created

### 1. **Root Layout Metadata** (`app/layout.tsx`)
- Comprehensive Open Graph tags
- Twitter Card metadata
- Structured robots configuration
- Site verification codes
- Icons and manifest configuration

### 2. **Metadata Configuration** (`lib/metadata.ts`)
- Reusable metadata generator functions
- Pre-configured metadata for all pages
- Centralized site configuration

### 3. **Structured Data** (`lib/structured-data.ts`)
- JSON-LD schemas for:
  - Organization
  - Restaurant
  - Gym/Fitness Center
  - Event Venue
  - Breadcrumbs
- Schema.org compliant markup

### 4. **Section Layouts**
Each section has its own layout with specific metadata:
- `app/fresh&fit/layout.tsx` - Gym metadata
- `app/nankwaase-bar-and-restaurant/layout.tsx` - Restaurant metadata
- `app/event-space/layout.tsx` - Event space metadata
- `app/cart/layout.tsx` - Cart metadata (noindex)
- `app/checkout/layout.tsx` - Checkout metadata (noindex)
- `app/dashboard/layout.tsx` - Dashboard metadata (noindex)

### 5. **Dynamic Sitemap** (`app/sitemap.ts`)
Automatically generates XML sitemap with:
- All public pages
- Priority levels
- Change frequencies
- Last modified dates

### 6. **PWA Configuration** (`public/site.webmanifest`)
Progressive Web App manifest with:
- App name and description
- Theme colors
- Icons
- Display preferences

### 7. **Robots.txt** (`public/robots.txt`)
Controls search engine crawling:
- Allows all crawlers
- Blocks private pages (dashboard, checkout)
- References sitemap

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Key Features

### ✅ Open Graph Tags
Full support for social media previews on:
- Facebook
- LinkedIn
- Twitter/X
- WhatsApp
- Other platforms

### ✅ Twitter Cards
Large image cards with rich previews

### ✅ Structured Data (JSON-LD)
Google-friendly schema markup for:
- Business information
- Restaurant details
- Fitness center info
- Event venue details
- Navigation breadcrumbs

### ✅ Dynamic Sitemap
Automatically generated and updated sitemap at `/sitemap.xml`

### ✅ Progressive Web App
Can be installed on mobile devices and desktop

### ✅ SEO-Friendly URLs
Clean, descriptive URLs:
- `/fresh&fit` - Gym
- `/nankwaase-bar-and-restaurant` - Restaurant
- `/event-space` - Events
- `/nankwaase-bar-and-restaurant/menu` - Menu

## Usage

### Add Structured Data to a Page

```tsx
import StructuredData from '@/components/StructuredData';
import { restaurantSchema } from '@/lib/structured-data';

export default function RestaurantPage() {
  return (
    <>
      <StructuredData data={restaurantSchema} />
      {/* Rest of your page */}
    </>
  );
}
```

### Generate Custom Page Metadata

```tsx
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Custom Page Title',
  description: 'Custom page description',
  keywords: ['keyword1', 'keyword2'],
  image: '/custom-og-image.jpg',
});
```

### Add Breadcrumbs Schema

```tsx
import { generateBreadcrumbSchema } from '@/lib/structured-data';

const breadcrumbData = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Restaurant', url: '/nankwaase-bar-and-restaurant' },
  { name: 'Menu', url: '/nankwaase-bar-and-restaurant/menu' },
]);

<StructuredData data={breadcrumbData} />
```

## Testing Your SEO

### Google Rich Results Test
Test structured data:
https://search.google.com/test/rich-results

### Facebook Sharing Debugger
Test Open Graph tags:
https://developers.facebook.com/tools/debug/

### Twitter Card Validator
Test Twitter cards:
https://cards-dev.twitter.com/validator

### Lighthouse SEO Audit
Run in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Check "SEO"
4. Click "Analyze page load"

## Next Steps

1. **Add Real Images**
   - Create `/public/og-image.jpg` (1200x630px)
   - Create `/public/twitter-image.jpg` (1200x628px)
   - Create app icons (192x192, 512x512)

2. **Set Environment Variables**
   - Update `NEXT_PUBLIC_SITE_URL` in production
   - Add Google verification code

3. **Submit Sitemap**
   - Google Search Console: Add `https://yourdomain.com/sitemap.xml`
   - Bing Webmaster Tools: Submit sitemap

4. **Configure Analytics**
   - Set up Google Analytics
   - Add tracking code if needed

5. **Social Media Setup**
   - Update social media handles in `lib/metadata.ts`
   - Verify all social links work

## Validation Checklist

- [ ] All pages have unique titles
- [ ] All pages have unique descriptions
- [ ] Images have alt text
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt is accessible at `/robots.txt`
- [ ] Manifest is accessible at `/site.webmanifest`
- [ ] Structured data validates without errors
- [ ] Open Graph images are correct size (1200x630)
- [ ] Mobile-friendly (test with Google Mobile-Friendly Test)
- [ ] Page load speed is optimized (test with PageSpeed Insights)

## Best Practices Applied

✅ Semantic HTML structure
✅ Proper heading hierarchy (h1, h2, h3)
✅ Descriptive URLs
✅ Mobile-first responsive design
✅ Fast page load times
✅ HTTPS ready
✅ Accessible navigation
✅ Schema.org markup
✅ Social media optimization
✅ Search engine friendly

---

Your site is now fully optimized for search engines and social media sharing!
