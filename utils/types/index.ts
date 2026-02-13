
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

export interface featuresProps {
    icon: React.ElementType;
    title: string;
    image: string;
}

export interface planProps {
    id: string;
    name: string;
    price: number;
    duration: string;
    features: string[];
    is_popular?: boolean;
}

export interface PlanCardProps {
    plan: planProps;
    onSelect: (plan: planProps) => void;
    index: number;
}

export interface EventSpaceProps {
    id: string;
    name: string;
    capacity: string;
    description: string;
    features: string[];
    image: string;
    price: number;
}

export interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
  image: string;
}

export interface Event {
  date: string;
  title: string;
  description: string;
}