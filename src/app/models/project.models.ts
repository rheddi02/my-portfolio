export enum ProjectCategory {
  WEB_APP = 'web-app',
  MOBILE_APP = 'mobile-app',
  DESKTOP_APP = 'desktop-app',
  API = 'api',
  LIBRARY = 'library',
  WEBSITE = 'website',
  GAME = 'game',
  OTHER = 'other'
}

export interface IProject {
  name: string;
  stacks: string;
  description: string;
  codeUrl: string;
  liveUrl: string;
  imageUrl?: string;
  featured?: boolean;
  category: ProjectCategory;
  completedDate?: Date;
  teamSize?: number;
  myRole?: string;
  challenges?: string[];
  achievements?: string[];
  tags?: string[];
}