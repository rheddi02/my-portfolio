export interface About {
  position: string;
  description: string;
  skills: {
    category: string
    lists: string[]
  }[];
  yearsOfExperience?: number;
  achievements: string[];
}