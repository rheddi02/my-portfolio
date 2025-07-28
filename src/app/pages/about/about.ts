import { CommonModule } from '@angular/common';
import { About } from '../../models/about.models';
import { AboutService } from './../../services/about.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutPage implements OnInit {
  about!: About;

  constructor(private aboutService: AboutService) {}

  ngOnInit(): void {
    this.about = this.aboutService.getAboutInfo();
  }

}
