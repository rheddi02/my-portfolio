export interface About {
  name: string;
  position: string;
  description: string;
  skills: {
    category: string
    lists: string[]
  }[];
  yearsOfExperience?: number;
  achievements: string[];
}