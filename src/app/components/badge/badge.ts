import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-badge',
  imports: [NgStyle],
  templateUrl: './badge.html',
  styleUrl: './badge.scss'
})
export class Badge {
  @Input() name: string = '';
}
