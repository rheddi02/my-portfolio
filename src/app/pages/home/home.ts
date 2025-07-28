import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCard } from '../../components/project-card/project-card';
import { Project, Profile } from '../../models/portfolio.models';
import { PortfolioService } from '../../services/portfolio.service';
import { AboutPage } from '../about/about';
import { Social } from "../social/social";

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProjectCard, AboutPage, Social],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  profile!: Profile;
  projects: Project[] = [];
  hoveredCardIndex: number | null = null;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.profile = this.portfolioService.getProfile();
    this.projects = this.portfolioService.getProjects();
  }

  onCardHover(index: number): void {
    this.hoveredCardIndex = index;
  }

  onCardLeave(): void {
    this.hoveredCardIndex = null;
  }

  isCardBlurred(index: number): boolean {
    return this.hoveredCardIndex !== null && this.hoveredCardIndex !== index;
  }
}
