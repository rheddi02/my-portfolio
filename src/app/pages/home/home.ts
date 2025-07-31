import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../models/portfolio.models';
import { PortfolioService } from '../../services/portfolio.service';
import { AboutPage } from '../about/about';
import { Social } from "../social/social";
import { Experience } from "../experience/experience";
import { Project } from '../project/project';
import { DownloadFile } from "../../components/download-file/download-file";

@Component({
  selector: 'app-home',
  imports: [CommonModule, AboutPage, Social, Experience, Project, DownloadFile],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  profile!: Profile;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.profile = this.portfolioService.getProfile();
  }

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
