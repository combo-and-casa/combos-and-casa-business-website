import type { NavItemsProps, ServiceCardProps, StatsProps } from "../types/index";
import { UtensilsCrossed, Dumbbell, PartyPopper } from "lucide-react";

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

