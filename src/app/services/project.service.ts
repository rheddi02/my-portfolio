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
      codeUrl: 'https://github.com/alfredo/portfolio',
      liveUrl: 'https://alfredo-portfolio.dev',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'E-Commerce Platform',
      stacks: 'React, Node.js, PostgreSQL',
      description:
        'Full-stack e-commerce solution with payment integration and admin dashboard',
      codeUrl: 'https://github.com/alfredo/ecommerce',
      liveUrl: 'https://alfredo-shop.com',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Task Management System',
      stacks: 'Vue.js, Firebase, Vuetify',
      description:
        'Real-time collaborative task management application with team features',
      codeUrl: 'https://github.com/alfredo/taskmanager',
      liveUrl: 'https://alfredo-tasks.com',
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
