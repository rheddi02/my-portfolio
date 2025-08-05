import { Injectable } from '@angular/core';
import { IProject, ProjectCategory } from '../models/project.models';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projects: IProject[] = [
    {
      name: 'Portfolio Website',
      stacks: ['Angular', 'Tailwind CSS', 'TypeScript'],
      description: `A responsive, single-page portfolio website built with Angular 18 and Tailwind CSS, designed to professionally showcase my work experience, technical skills, and development projects — including this portfolio itself.
The site includes features such as a downloadable CV, categorized project listings, a detailed work history section, a skills overview (with both current technologies and future learning goals like Kubernetes), and social media links for easy networking. With a focus on UI/UX best practices, the design is optimized for mobile and desktop, using Tailwind’s utility-first styling and Angular’s component architecture to ensure performance, accessibility, and clarity.`,
      codeUrl: '',
      liveUrl: 'https://itsmealfred.site',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Admin Panel Platform',
      stacks: [
        'React',
        'NextJS',
        'PostgreSQL',
        'Tailwind CSS',
        'Shadcn UI',
        'NestJS',
      ],
      description:
        'Built a full-stack e-commerce platform with an integrated admin dashboard for managing products, users, orders, and real-time sales analytics using modern frameworks and best practices',
      codeUrl: '',
      liveUrl: 'https://waterfill.vercel.app',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'URL Collections Management System',
      stacks: [
        'NextJS',
        'TypeScript',
        'Shadcn UI',
        'PostgreSQL',
        'Prisma',
        'JWT',
        'Tailwind CSS',
        'Nodemailer',
      ],
      description: `A fullstack web application that lets users save and categorize external links for easy access, with email verification for security and rich profile customization.
      LinkCollect is a secure link bookmarking tool for organizing and categorizing external URLs. Users can register, verify their email. Each account includes a dashboard summarizing their saved links, categories, and profile data — optimized for both desktop and mobile.
        `,
      codeUrl: '',
      liveUrl: 'https://link-collect.vercel.app',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Sales Management System',
      stacks: ['NextJS', 'Shadcn UI', 'PostgreSQL', 'Tailwind CSS'],
      description: `A mobile-first web application built with Next.js and Tailwind CSS to efficiently manage sales, customers, purchases, and stock inventory. The app includes a real-time sales summary report, secure user authentication, and is fully deployed on Vercel with a PostgreSQL database.
        Designed for speed, responsiveness, and real-world usability, this project demonstrates fullstack development skills and practical business logic implementation.`,
      codeUrl: '',
      liveUrl: 'https://dreamy.vercel.app/',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Horse Racing System',
      stacks: [
        'Vue.js',
        'Tailwind CSS',
        'TypeScript',
        'PHP',
        'Laravel',
        'Stripe',
        'MySQL',
      ],
      description: `A cloud-hosted SaaS application designed for horse racing enthusiasts to track live race schedules, results, and get real-time updates on specific horses. The platform offers a subscription model where paid users unlock advanced features like instant updates, push notifications, and horse tracking, even when the app is running in the background.
      Engineered for performance, scalability, and user engagement, the platform is ideal for both casual fans and serious bettors looking for immediate, reliable race information.`,
      codeUrl: '',
      liveUrl: '',
      category: ProjectCategory.WEB_APP,
    },
  ];
  getProjects(): IProject[] {
    return this.projects;
  }

  // Observable methods for future API integration
  getProjects$(): Observable<IProject[]> {
    return of(this.projects);
  }
  // Method to add new project (for future use)
  addProject(project: IProject): void {
    this.projects.push(project);
  }
}
