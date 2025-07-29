import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IExperience } from '../../models/experience.models';
import { ExperienceService } from '../../services/experience.service';
import { Badge } from "../../components/badge/badge";

@Component({
  selector: 'app-experience',
  imports: [CommonModule, Badge],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience implements OnInit{
  experience!: IExperience;
  experiences: IExperience[] = [];

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.experiences = this.experienceService.getExperiences();
  }
}
