

export interface Profile {
  name: string;
  position: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  profileImage?: string;
  resumeUrl?: string;
  yearsOfExperience?: number;
  availableForWork?: boolean;
  description: string;
  learning?: string[];
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date; // undefined means current job
  description: string;
  responsibilities: string[];
  achievements?: string[];
  technologies: string[];
  companyLogo?: string;
  companyUrl?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  description?: string;
  achievements?: string[];
  relevant_courses?: string[];
}

export interface Skill {
  id?: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillLevel;
  yearsOfExperience?: number;
  icon?: string;
  description?: string;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  logo?: string;
}



// export interface ContactInfo {
//   email: string;
//   phone?: string;
//   location?: string;
//   timezone?: string;
//   socialLinks: SocialLink[];
//   availability?: string;
// }

export interface Testimonial {
  id?: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating?: number;
  avatar?: string;
  date?: Date;
  featured?: boolean;
}

export interface Achievement {
  id?: string;
  title: string;
  description: string;
  date: Date;
  category: AchievementCategory;
  icon?: string;
  url?: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content?: string;
  publishDate: Date;
  readTime?: number;
  tags: string[];
  featured?: boolean;
  imageUrl?: string;
  url?: string;
}


export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  DEVOPS = 'devops',
  MOBILE = 'mobile',
  DESIGN = 'design',
  TESTING = 'testing',
  TOOLS = 'tools',
  SOFT_SKILLS = 'soft-skills'
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}


export enum AchievementCategory {
  AWARD = 'award',
  CERTIFICATION = 'certification',
  PUBLICATION = 'publication',
  SPEAKING = 'speaking',
  OPEN_SOURCE = 'open-source',
  HACKATHON = 'hackathon',
  COMPETITION = 'competition'
}

// Utility types
export type ContactFormData = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  company?: string;
  budget?: string;
  timeline?: string;
}

export type PortfolioSettings = {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  showContactForm: boolean;
  showBlog: boolean;
  showTestimonials: boolean;
  socialLinksInHeader: boolean;
  enableAnimations: boolean;
}
