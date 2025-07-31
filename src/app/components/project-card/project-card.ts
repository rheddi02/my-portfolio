import { Component, Input } from '@angular/core';
import { Badge } from "../badge/badge";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-card',
  imports: [Badge,CommonModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss'
})
export class ProjectCard {
  @Input() name: string = '';
  @Input() stacks: string[] = [];
  @Input() description: string = '';
  @Input() codeUrl: string = '';
  @Input() liveUrl: string = '';
}
