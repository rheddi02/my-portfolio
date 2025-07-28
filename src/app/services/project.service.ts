import { Injectable } from '@angular/core';
import { IProject, ProjectCategory } from '../models/project.models';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projects: IProject[] = [
    {
      name: 'Portfolio Website',
      stacks: 'Angular, Tailwind CSS, TypeScript',
      description:
        'A modern, responsive portfolio website built with Angular 18 and Tailwind CSS',
      codeUrl: '',
      liveUrl: 'https://itsmealfred.site',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Admin Panel Platform',
      stacks: 'React, NextJS, PostgreSQL, Tailwind CSS, Shadcn UI, NestJS',
      description:
        'Full-stack e-commerce solution for admin management',
      codeUrl: '',
      liveUrl: 'https://waterfill.vercel.app',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Task Management System',
      stacks: 'NextJS, Shadcn UI, PostgreSQL, Tailwind CSS',
      description:
        'Collection of links to various social media platforms that is categorized for easy access with admin control panel',
      codeUrl: '',
      liveUrl: 'https://fbcollections.vercel.app/client',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Sales Management System',
      stacks: 'NextJS, Shadcn UI, PostgreSQL, Tailwind CSS',
      description:
        'A mobile-first project for managing sales, customers purchases and inventory.',
      codeUrl: '',
      liveUrl: 'https://dreamy.vercel.app/',
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
