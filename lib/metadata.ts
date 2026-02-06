import { Metadata } from "next";

export const siteConfig = {
  name: "Combos & Casa",
  description: "Experience the ultimate lifestyle destination combining Fresh & Fit gym, Nankwaase Bar & Restaurant fine dining, and elegant event spaces for weddings, corporate events, and celebrations.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/combosandcasa",
    facebook: "https://facebook.com/combosandcasa",
    instagram: "https://instagram.com/combosandcasa",
  },
  contact: {
    email: "info@combosandcasa.com",
    phone: "+1 (234) 567-890",
    address: "123 Premium Street, Lifestyle District",
  },
};

export function generatePageMetadata({
  title,
  description,
  image = siteConfig.ogImage,
  keywords = [],
  noIndex = false,
}: {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    keywords: [...keywords, "Combos & Casa", "lifestyle", "premium"],
    openGraph: {
      title,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@combosandcasa",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

// Pre-configured metadata for common pages
export const pageMetadata = {
  home: generatePageMetadata({
    title: "Home | Premium Fitness, Fine Dining & Event Space",
    description: "Discover your ultimate lifestyle destination. Join Fresh & Fit gym, dine at Nankwaase Bar & Restaurant, and celebrate in our elegant event spaces.",
    keywords: ["fitness center", "premium gym", "fine dining", "event venue", "lifestyle hub"],
  }),
  
  gym: generatePageMetadata({
    title: "Fresh & Fit Gym | Premium Fitness Center",
    description: "Transform your fitness journey at Fresh & Fit. State-of-the-art equipment, expert trainers, and flexible membership plans. Join today!",
    keywords: ["gym membership", "fitness classes", "personal training", "Fresh & Fit", "workout facility"],
  }),
  
  restaurant: generatePageMetadata({
    title: "Nankwaase Bar & Restaurant | Fine Dining Experience",
    description: "Indulge in culinary excellence at Nankwaase Bar & Restaurant. Chef-crafted menu, premium wines, and exceptional service.",
    keywords: ["fine dining", "restaurant", "bar", "Nankwaase", "gourmet food", "wine selection"],
  }),
  
  restaurantMenu: generatePageMetadata({
    title: "Menu | Nankwaase Bar & Restaurant",
    description: "Explore our chef-crafted menu featuring locally sourced ingredients and world-class wines. Order online for pickup or delivery.",
    keywords: ["restaurant menu", "food delivery", "takeout", "online ordering", "gourmet meals"],
  }),
  
  restaurantAbout: generatePageMetadata({
    title: "About Us | Nankwaase Bar & Restaurant",
    description: "Learn about our culinary philosophy, experienced chefs, and commitment to exceptional dining experiences.",
    keywords: ["restaurant story", "chef", "culinary excellence", "dining experience"],
  }),
  
  restaurantReservations: generatePageMetadata({
    title: "Reservations | Nankwaase Bar & Restaurant",
    description: "Reserve your table at Nankwaase Bar & Restaurant. Book online for lunch, dinner, or special occasions.",
    keywords: ["table reservation", "book restaurant", "dining reservation", "reserve table"],
  }),
  
  events: generatePageMetadata({
    title: "Event Space | Weddings, Corporate Events & Celebrations",
    description: "Host unforgettable events in our elegant spaces. Perfect for weddings, corporate gatherings, birthdays, and special celebrations.",
    keywords: ["event space", "wedding venue", "corporate events", "party venue", "event booking"],
  }),
  
  cart: generatePageMetadata({
    title: "Shopping Cart | Order Summary",
    description: "Review your order and proceed to checkout. Fast and secure online ordering.",
    keywords: ["shopping cart", "order review", "checkout"],
    noIndex: true,
  }),
  
  checkout: generatePageMetadata({
    title: "Checkout | Complete Your Order",
    description: "Complete your order securely. Choose pickup or delivery options.",
    keywords: ["checkout", "payment", "order completion"],
    noIndex: true,
  }),
  
  dashboard: generatePageMetadata({
    title: "Dashboard | My Account",
    description: "Manage your orders, memberships, and event bookings in one place.",
    keywords: ["user dashboard", "my account", "order history"],
    noIndex: true,
  }),
  
  contact: generatePageMetadata({
    title: "Contact Us | Get in Touch",
    description: "Have questions? Reach out to our team. We're here to help with fitness, dining, and event inquiries.",
    keywords: ["contact", "customer support", "get in touch", "inquiries"],
  }),
};
