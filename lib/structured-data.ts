import { siteConfig } from "./metadata";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": siteConfig.name,
  "description": siteConfig.description,
  "url": siteConfig.url,
  "logo": `${siteConfig.url}/logo.png`,
  "image": `${siteConfig.url}${siteConfig.ogImage}`,
  "email": siteConfig.contact.email,
  "telephone": siteConfig.contact.phone,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": siteConfig.contact.address,
  },
  "sameAs": [
    siteConfig.links.twitter,
    siteConfig.links.facebook,
    siteConfig.links.instagram,
  ],
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${siteConfig.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Nankwaase Bar & Restaurant",
  "description": "Fine dining restaurant serving chef-crafted cuisine with locally sourced ingredients and world-class wines.",
  "url": `${siteConfig.url}/nankwaase-bar-and-restaurant`,
  "image": `${siteConfig.url}/restaurant-image.jpg`,
  "servesCuisine": ["International", "Contemporary", "Fine Dining"],
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": siteConfig.contact.address,
  },
  "telephone": siteConfig.contact.phone,
  "email": siteConfig.contact.email,
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "11:00",
      "closes": "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "23:00",
    },
  ],
  "acceptsReservations": true,
  "menu": `${siteConfig.url}/nankwaase-bar-and-restaurant/menu`,
};

export const gymSchema = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "Fresh & Fit Gym",
  "description": "Premium fitness center with state-of-the-art equipment, expert trainers, and flexible membership plans.",
  "url": `${siteConfig.url}/fresh&fit`,
  "image": `${siteConfig.url}/gym-image.jpg`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": siteConfig.contact.address,
  },
  "telephone": siteConfig.contact.phone,
  "email": siteConfig.contact.email,
  "priceRange": "$$",
  "paymentAccepted": "Cash, Credit Card, Debit Card",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "05:00",
      "closes": "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "07:00",
      "closes": "20:00",
    },
  ],
};

export const eventVenueSchema = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  "name": "Combos & Casa Event Space",
  "description": "Elegant event space perfect for weddings, corporate events, and special celebrations.",
  "url": `${siteConfig.url}/event-space`,
  "image": `${siteConfig.url}/event-space-image.jpg`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": siteConfig.contact.address,
  },
  "telephone": siteConfig.contact.phone,
  "email": siteConfig.contact.email,
  "maximumAttendeeCapacity": 200,
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Audio/Visual Equipment",
      "value": true,
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Catering",
      "value": true,
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "WiFi",
      "value": true,
    },
  ],
};

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${siteConfig.url}${item.url}`,
    })),
  };
}
