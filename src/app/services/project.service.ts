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
      liveUrl: 'https://link-collect.vercel.app/client',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Sales Management System',
      stacks: ['NextJS', 'Shadcn UI', 'PostgreSQL', 'Tailwind CSS'],
      description:
        'A mobile-first project for managing sales, customers purchases and inventory.',
      codeUrl: '',
      liveUrl: 'https://dreamy.vercel.app/',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Horse Racing System',
      stacks: ['Vue.js', 'Tailwind CSS', 'TypeScript', 'PHP', 'Laravel'],
      description:
        'Developed a SaaS horse racing platform that allows users to sign up and track live race schedules and results. Subscribers get access to real-time updates for specific horses, with no delay, and receive push notifications even when the app is not focused. The platform is cloud-hosted, scalable, and designed with performance and user engagement in mind.',
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
