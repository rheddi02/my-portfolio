export interface IExperience {
  company: string;
  position: string;
  description: string;
  dateStart: string;
  dateEnd?: string;
  achievements: string[];
  stacks?: string[];
}