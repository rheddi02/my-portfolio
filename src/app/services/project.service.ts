import { Injectable } from '@angular/core';
import { IProject, ProjectCategory } from '../models/project.models';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projects: IProject[] = [
    {
      name: 'Portfolio Website',
      stacks: ['Angular', 'Tailwind CSS', 'TypeScript'],
      description:
        'A modern, responsive portfolio website built with Angular 18 and Tailwind CSS',
      codeUrl: '',
      liveUrl: 'https://itsmealfred.site',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Admin Panel Platform',
      stacks: ['React', 'NextJS', 'PostgreSQL', 'Tailwind CSS', 'Shadcn UI', 'NestJS'],
      description:
        'Built a full-stack e-commerce platform with an integrated admin dashboard for managing products, users, orders, and real-time sales analytics using modern frameworks and best practices',
      codeUrl: '',
      liveUrl: 'https://waterfill.vercel.app',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'URL Collections Management System',
      stacks: ['NextJS', 'Shadcn UI', 'PostgreSQL', 'Tailwind CSS'],
      description:
        'Built a categorized link directory for various social media platforms, featuring an admin control panel for easy management, access control, and content organization',
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
      description: 'I developed a SaaS horse racing platform that allows users to sign up and track live race schedules and results. Subscribers get access to real-time updates for specific horses, with no delay, and receive push notifications even when the app is not focused. The platform is cloud-hosted, scalable, and designed with performance and user engagement in mind.',
      codeUrl: '',
      liveUrl: '',
      category: ProjectCategory.WEB_APP,
    }
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
