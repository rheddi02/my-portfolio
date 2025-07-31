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
      dateStart: formatDate(new Date('2022-12-06'), false, false),
      dateEnd: formatDate(new Date('2025-07-04'), false),
      achievements: [
        'Developed and launched a new feature that increased user engagement by 20%, based on key user interaction metrics',
        'Optimized the existing codebase, resulting in a 30% reduction in load times and improved overall performance',
        'Participated in the successful migration of data from legacy systems to a modern, scalable architecture',
        'Designed and implemented a robust POS system to enable fast transactions and efficient inventory management',
        'Collaborated with cross-functional teams (including designers, QA, and product managers) to deliver high-quality, maintainable software solutions',
        'Contributed to the frontend migration from Vue.js to React.js, improving code maintainability and developer experience',
        'Created and maintained a library of reusable UI components, significantly accelerating development cycles and ensuring consistency across the application',
      ],
      stacks: [
        'React.js',
        'Next.js',
        'Node.js',
        'Express.js',
        'AdonisJS',
        'MongoDB',
        'GraphQL',
        'PostgreSQL',
        'TypeScript',
        'Tailwind CSS',
        'Shadcn UI',
        'Stripe',
      ],
    },
    {
      company: 'Qonvex',
      position: 'Backend Developer',
      description:
        'Focused on building responsive web applications using Vue.js and PHP',
      dateStart: formatDate(new Date('2019-09-01'), false, false),
      dateEnd: formatDate(new Date('2022-11-30'), false),
      achievements: [
        'Redesigned the user interface, leading to a 25% increase in user satisfaction, as measured by user feedback and analytics',
        'Worked closely with front-end developers to seamlessly integrate RESTful APIs, ensuring reliable and scalable data exchange',
        'Implemented server-side rendering (SSR) to significantly improve page load times and SEO performance',
        'Led a team of 3 developers in delivering a high-impact project ahead of schedule, while maintaining code quality and performance standards',
        'Mentored junior developers, fostering skill growth and contributing to an overall increase in team productivity and code quality',
      ],
      stacks: [
        'Vue.js',
        'PHP',
        'Laravel',
        'MySQL',
        'JavaScript',
        'HTML',
        'CSS',
      ],
    },
  ];
  getExperiences(): IExperience[] {
    return this.experiences;
  }
}
