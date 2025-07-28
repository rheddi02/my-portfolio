import { Injectable } from '@angular/core';
import { IExperience } from '../models/experience.models';
import { formatDate } from '../utils/date.utils';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private experiences: IExperience[] = [
    {
      company: 'Freshclinics',
      position: 'Senior Software Engineer',
      description: 'Worked on various projects using React.js and Node.js',
      dateStart: formatDate(new Date('2022-12-06')),
      dateEnd: formatDate(new Date('2025-07-04')),
      achievements: [
        'Implemented a new feature that improved user engagement by 20%',
        'Optimized existing codebase, reducing load times by 30%',
        'Take part on data migration from legacy systems to modern architecture',
        'Implemented POS system for fast transactions and inventory management',
        'Collaborated with cross-functional teams to deliver high-quality software solutions',
        'Take part on project migration from Vue.js to React.js',
        'Created reusable components to streamline development processes',
      ],
    },
    {
      company: 'Qonvex',
      position: 'Backend Developer',
      description: 'Focused on building responsive web applications using Vue.js and PHP',
      dateStart: formatDate(new Date('2019-09-01')),
      dateEnd: formatDate(new Date('2022-11-30')),
      achievements: [
        'Redesigned the user interface, resulting in a 25% increase in user satisfaction',
        'Collaborated with front-end developers to integrate RESTful APIs',
        'Implemented server-side rendering for improved performance',
        'Led a team of 5 developers to deliver a major project ahead of schedule',
        'Mentored junior developers, enhancing team productivity',
      ],
    },
  ];
  getExperiences(): IExperience[] {
    return this.experiences;
  }
}

