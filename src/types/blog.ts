export interface Blog {
    title: string;
    excerpt?: string;
    category?: string[];
    date: string | Date;
    readTime?: string;
    iconClass?: string;
    featuredImage?: string;
    url?: string;
    featured?: boolean;
    content: string;
    slug: string; // The filename without the .md extension
  }