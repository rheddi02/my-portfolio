export interface About {
  position: string;
  description: string;
  activeSKills: string[];
  skills: {
    category: string
    lists: string[]
  }[];
  yearsOfExperience?: number;
  achievements: string[];
}