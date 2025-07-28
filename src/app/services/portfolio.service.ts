import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Profile, Project, ProjectCategory } from "../models/portfolio.models";

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private projects: Project[] = [
    {
      name: 'Portfolio Website',
      stacks: 'Angular, Tailwind CSS, TypeScript',
      description: 'A modern, responsive portfolio website built with Angular 18 and Tailwind CSS',
      codeUrl: 'https://github.com/alfredo/portfolio',
      liveUrl: 'https://alfredo-portfolio.dev',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'E-Commerce Platform',
      stacks: 'React, Node.js, PostgreSQL',
      description: 'Full-stack e-commerce solution with payment integration and admin dashboard',
      codeUrl: 'https://github.com/alfredo/ecommerce',
      liveUrl: 'https://alfredo-shop.com',
      category: ProjectCategory.WEB_APP,
    },
    {
      name: 'Task Management System',
      stacks: 'Vue.js, Firebase, Vuetify',
      description: 'Real-time collaborative task management application with team features',
      codeUrl: 'https://github.com/alfredo/taskmanager',
      liveUrl: 'https://alfredo-tasks.com',
      category: ProjectCategory.WEB_APP,
    }
  ];

  private profile: Profile = {
    name: 'Alfredo S. Diomangay, Jr.',
    position: 'Full Stack Web Developer',
    description: 'Passionate full stack developer with a focus on building modern web applications. Experienced in Angular, React, and Node.js.',
  };

  // Synchronous methods for simple data
  getProjects(): Project[] {
    return this.projects;
  }

  getProfile(): Profile {
    return this.profile;
  }

  // Observable methods for future API integration
  getProjects$(): Observable<Project[]> {
    return of(this.projects);
  }

  getProfile$(): Observable<Profile> {
    return of(this.profile);
  }

  // Method to add new project (for future use)
  addProject(project: Project): void {
    this.projects.push(project);
  }

  // Method to update profile (for future use)
  updateProfile(profile: Partial<Profile>): void {
    this.profile = { ...this.profile, ...profile };
  }
}
