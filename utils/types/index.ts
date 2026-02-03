
export interface NavItemsProps {
    pageName: string;
    pathname: string;
}

export interface ServiceCardProps {
   title: string; 
  subtitle: string; 
  description: string; 
  image: string; 
  ctaText: string; 
  ctaLink: string; 
  icon: React.ElementType;
  index: number;
}

export interface StatsProps {
    number: string;
    label: string;
}

export interface TestimonialProps {
    name: string;
    role: string;
    image: string;
    text: string;
}
