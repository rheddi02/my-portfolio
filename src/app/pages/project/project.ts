import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { IProject } from '../../models/project.models';
import { ProjectCard } from '../../components/project-card/project-card';

@Component({
  selector: 'app-project',
  imports: [CommonModule, ProjectCard],
  templateUrl: './project.html',
  styleUrl: './project.scss'
})
export class Project implements OnInit {
  projects: IProject[] = [];
  hoveredCardIndex: number | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
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

