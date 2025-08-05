import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Profile } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private profile: Profile = {
    name: 'Alfredo S. Diomangay, Jr.',
    position: 'Full Stack Web Developer',
    description:
      'Seasoned full stack web developer with extensive experience in building robust, scalable, and secure web applications from front to back. Skilled in modern frameworks like Next.js with Tailwind and TypeScript on the frontend, and powerful backend solutions using Node.js, AdonisJS, and Express. ',
    learning: [
      'Kubernetes & CI/CD with GitHub Actions',
      'AWS Services (S3, EC2, RDS)',
      'AI integration via OpenAI APIs',
      'NestJS',
      'Angular',
      'GraphQL',
      'RSC-first depevelopment',
      'Microservices architecture',
    ]
  };

  getProfile(): Profile {
    return this.profile;
  }

  getProfile$(): Observable<Profile> {
    return of(this.profile);
  }

  // Method to update profile (for future use)
  updateProfile(profile: Partial<Profile>): void {
    this.profile = { ...this.profile, ...profile };
  }
}
