import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-card',
  imports: [],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss'
})
export class ProjectCard {
  @Input() name: string = '';
  @Input() stacks: string = '';
  @Input() description: string = '';
  @Input() codeUrl: string = '';
  @Input() liveUrl: string = '';
}
