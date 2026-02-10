import type { 
    NavItemsProps, 
    ServiceCardProps,
    StatsProps, 
    featuresProps,
    planProps,
    Service,
    Event 
} from "../types/index";
import { 
    UtensilsCrossed, 
    Dumbbell, 
    PartyPopper,
    Users,
    Target,
    Clock,
    Calendar,
    Award,
    ChefHat,
    Wine
} from "lucide-react";

export const navItems: NavItemsProps[] = [
        // { pageName: "Home", pathname: "/" },
        // { pageName: "Restaurant", pathname: "/restaurant" },
        { pageName: "Fresh & Fit", pathname: "/fresh&fit" },
        { pageName: "Event Spaces", pathname: "/event-space" },
        { pageName: "Contact", pathname: "/contact" },
    ];

export const restaurantItems: NavItemsProps[] = [
        { pageName: "About", pathname: "/nankwaase-bar-and-restaurant/about" },
        { pageName: "Menu", pathname: "/nankwaase-bar-and-restaurant/menu" },
        { pageName: "Reservations", pathname: "/nankwaase-bar-and-restaurant/reservations" },
    ];

export const services: ServiceCardProps[] = [
        {
            title: "Nankwaase Bar & Restaurant",
            subtitle: "Culinary Excellence",
            description: "Indulge in an extraordinary dining experience with our chef-crafted menu featuring locally sourced ingredients and world-class wines.",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
            ctaText: "Order Food",
            ctaLink: "/nankwaase-bar-and-restaurant/about",
            icon: UtensilsCrossed,
            index: 0
        },
        {
            title: "Fresh & Fit Fitness Center",
            subtitle: "Transform Your Body",
            description: "State-of-the-art equipment, expert trainers, and premium amenities to help you achieve your fitness goals in style.",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
            ctaText: "Join the Gym",
            ctaLink: "/fresh&fit",
            icon: Dumbbell,
            index: 1
        },
        {
            title: "Event Spaces",
            subtitle: "Unforgettable Moments",
            description: "From intimate gatherings to grand celebrations, our versatile event spaces provide the perfect backdrop for your special occasions.",
            image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
            ctaText: "Book an Event",
            ctaLink: "/event-space",
            icon: PartyPopper,
            index: 2
        }
      ];

export const stats: StatsProps[] = [
    { number: "15K+", label: "Happy Members" },
    { number: "50+", label: "Expert Trainers" },
    { number: "200+", label: "Events Hosted" },
    { number: "4.9", label: "Average Rating" }
  ];

export const testimonials = [
    {
        name: "Sarah Mitchell",
        role: "Fitness Enthusiast",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        text: "VENUE has transformed my lifestyle completely. The gym facilities are world-class, and after my workout, I treat myself to their amazing restaurant. It's become my second home."
    },
    {
        name: "James Chen",
        role: "Business Executive",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        text: "We've hosted multiple corporate events at VENUE and each one has been flawless. The team's attention to detail and the stunning spaces make every occasion memorable."
    },
    {
        name: "Elena Rodriguez",
        role: "Food Critic",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        text: "The culinary experience here rivals the best restaurants in the city. The fusion of flavors, impeccable service, and elegant ambiance create a truly exceptional dining destination."
    }
];


export const features: featuresProps[] = [
    {
      icon: Dumbbell,
      title: "Cardio & Weights",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
    },
    {
      icon: Users,
      title: "Personal Training",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
    },
    {
      icon: Target,
      title: "Strength Training",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80"
    },
    {
      icon: Clock,
      title: "Walk-in Sessions",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
    },
    {
      icon: Calendar,
      title: "Group Classes",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80"
    },
    {
      icon: Award,
      title: "Premium Memberships",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80"
    }
  ];

export const plans: planProps[] = [
    {
      name: "Basic",
        price: 29,
        duration: "month",
        features: [
        "Access to all gym equipment",
        "1 personal training session",
        "Access to group classes"
      ]
    },
    {
      name: "Standard",
        price: 49,
        duration: "month",
        features: [
        "Access to all gym equipment",
        "4 personal training sessions",
        "Access to group classes",
        "1 guest pass per month"
      ],
      is_popular: true
    },
    {
      name: "Premium",
        price: 79,
        duration: "month",
        features: [
        "Unlimited access to all gym equipment",
        "8 personal training sessions",
        "Access to group classes",
        "5 guest passes per month",
        "Free merchandise pack"
      ]
    }
  ];

export const restaurantServices: Service[] = [
    {
      icon: ChefHat,
      title: "Fine Dining",
      description: "Experience culinary artistry with our chef's innovative seasonal menu. Every dish is crafted with precision using locally sourced ingredients, creating an unforgettable gastronomic journey.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
    },
    {
      icon: Wine,
      title: "Premium Bar",
      description: "Curated wine list and craft cocktails by expert mixologists. Our bar features an extensive collection of fine wines and signature cocktails that perfectly complement your dining experience.",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80"
    },
    {
      icon: UtensilsCrossed,
      title: "Private Dining",
      description: "Intimate dining experiences for special occasions. Our private dining rooms offer an exclusive setting for celebrations, business dinners, and memorable gatherings with personalized service.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
    },
    {
      icon: Calendar,
      title: "Chef's Table",
      description: "Exclusive tasting menus with behind-the-scenes experience. Join us for an interactive culinary journey where our chef creates a bespoke menu while you watch the magic happen.",
      image: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1200&q=80"
    }
  ];

export const upcomingEvents: Event[] = [
    {
      date: "Feb 14",
      title: "Valentine's Special Menu",
      description: "Romantic 5-course dinner with wine pairing"
    },
    {
      date: "Feb 20",
      title: "Wine Tasting Evening",
      description: "Explore premium wines from around the world"
    },
    {
      date: "Mar 1",
      title: "Chef's Table Experience",
      description: "Interactive dining with our executive chef"
    }
  ];

