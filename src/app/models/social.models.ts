
export enum SocialPlatform {
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  MEDIUM = 'medium',
  DEV_TO = 'dev.to',
  STACKOVERFLOW = 'stackoverflow',
  CODEPEN = 'codepen',
  DRIBBBLE = 'dribbble',
  BEHANCE = 'behance',
  PERSONAL_WEBSITE = 'website',
  FACEBOOK = 'facebook',
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  username?: string;
  icon?: string;
}