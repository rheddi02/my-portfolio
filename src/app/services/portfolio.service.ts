import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Profile } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private profile: Profile = {
    name: 'Alfredo S. Diomangay, Jr.',
    position: 'Full Stack Web Developer',
    description:
      'Passionate full stack developer with a focus on building modern web applications. Experienced in Angular, React, and Node.js.',
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
