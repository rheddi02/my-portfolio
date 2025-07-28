import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SocialLink } from '../../models/social.models';
import { SocialService } from '../../services/social.service';

@Component({
  selector: 'app-social',
  imports: [CommonModule],
  templateUrl: './social.html',
  styleUrl: './social.scss'
})
export class Social implements OnInit {
  socialLink!: SocialLink
  socialLinks: SocialLink[] = [];

  constructor( 
    private socialService: SocialService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.socialLinks = this.socialService.getSocialPlatforms();
  }

  getSafeIcon(iconHtml: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(iconHtml);
  }
}
