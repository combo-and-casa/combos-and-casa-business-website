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
            title: "Nankwase Bar & Restaurant",
            subtitle: "Culinary Excellence",
            description: "Indulge in an extraordinary dining experience with our chef-crafted menu featuring locally sourced ingredients and world-class wines.",
            image: "/jollof-in-hand.jpeg",
            ctaText: "Order Food",
            ctaLink: "/nankwase-bar-and-restaurant/about",
            icon: UtensilsCrossed,
            index: 0
        },
        {
            title: "Fresh & Fit Fitness Center",
            subtitle: "Transform Your Body",
            description: "State-of-the-art equipment, expert trainers, and premium amenities to help you achieve your fitness goals in style.",
            image: "https://combo-and-casa.github.io/images/state-of-the-art_%E2%99%80.jpg",
            ctaText: "Join the Gym",
            ctaLink: "/fresh&fit",
            icon: Dumbbell,
            index: 1
        },
        {
            title: "Event Spaces",
            subtitle: "Unforgettable Moments",
            description: "From intimate gatherings to grand celebrations, our versatile event spaces provide the perfect backdrop for your special occasions.",
            image: "/event-space-with-couple.webp",
            ctaText: "Book an Event",
            ctaLink: "/event-space",
            icon: PartyPopper,
            index: 2
        }
      ];

export const stats: StatsProps[] = [
    { number: "5K+", label: "Happy Customers" },
    { number: "10+", label: "Expert Trainers" },
    { number: "100+", label: "Events Hosted" },
    { number: "4.7", label: "Average Rating" }
  ];

export const testimonials = [
    {
        name: "Miss S A",
        role: "Customer",
        image: "/lady-by-fresh-and-fit-logo.jpeg",
        text: "Amazing food and Very friendly staff. beautiful ambiance. I had a wonderful dining experience at Nankwase Bar & Restaurant. The food was delicious, the service was impeccable, and the atmosphere was perfect for a romantic evening."
    },
    {
        name: "Mohammad Al Moussawi",
        role: "Local Guide",
        image: "/lady-training-the-legs.jpeg",
        text: "Beautiful place great food and nice experience. The event space was perfect for our corporate gathering. The staff was attentive and the catering was top-notch, making our event a huge success."
    },
    {
        name: "MAry Tokoli",
        role: "Customer",
        image: "/lady-training-the-legs.jpeg",
        text: "The culinary experience here rivals the best restaurants in the city. The fusion of flavors, impeccable service, and elegant ambiance create a truly exceptional dining destination."
    }
];


export const features: featuresProps[] = [
    {
      icon: Dumbbell,
      title: "Cardio & Weights",
      image: "https://combo-and-casa.github.io/images/gym-weights.jpg"
    },
    {
      icon: Users,
      title: "Personal Training",
      image: "/gym-group-sessions.jpeg"
    },
    {
      icon: Target,
      title: "Strength Training",
      image: "/lady-training-the-legs.jpeg"
    },
    {
      icon: Clock,
      title: "Walk-in Sessions",
      image: "/lady-by-fresh-and-fit-logo.jpeg"
    },
    {
      icon: Calendar,
      title: "Group Classes",
      image: "/ladies-on-bikes.jpeg"
    },
    {
      icon: Award,
      title: "Premium Memberships",
      image: "https://combo-and-casa.github.io/images/state-of-the-art_%E2%99%80.jpg"
    }
  ];

export const plans: planProps[] = [
    {
      id: "550e8400-e29b-41d4-a716-446655440001", // Basic plan UUID
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
      id: "550e8400-e29b-41d4-a716-446655440002", // Standard plan UUID
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
      id: "550e8400-e29b-41d4-a716-446655440003", // Premium plan UUID
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
      image: "/pasta-2.jpg"
    },
    {
      icon: Wine,
      title: "Premium Bar",
      description: "Curated wine list and craft cocktails by expert mixologists. Our bar features an extensive collection of fine wines and signature cocktails that perfectly complement your dining experience.",
      image: "/bar-mockup-2.jpg"
    },
    {
      icon: UtensilsCrossed,
      title: "Private Dining",
      description: "Intimate dining experiences for special occasions. Our private dining rooms offer an exclusive setting for celebrations, business dinners, and memorable gatherings with personalized service.",
      image: "/vip-dining.jpeg"
    },
    {
      icon: Calendar,
      title: "Chef's Table",
      description: "Exclusive tasting menus with behind-the-scenes experience. Join us for an interactive culinary journey where our chef creates a bespoke menu while you watch the magic happen.",
      image: "/fries-and-chicken.jpg"
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

