import { Injectable } from '@angular/core';
import { About } from '../models/about.models';

@Injectable({ providedIn: 'root' })
export class AboutService {
  private about: About = {
    position: 'Senior Full Stack Web Developer',
    description: `I'm a passionate
    <strong class="text-foreground">Full Stack Web Developer</strong> with 6+
    years of experience building scalable, user-centric applications. I
    specialize in <strong class="text-foreground">React</strong>,
    <strong class="text-foreground">Node.js</strong>, and
    <strong class="text-foreground">PostgreSQL</strong>, with a strong
    foundation in performance optimization, RESTful APIs, and DevOps.
    I also have basic knowledge of <strong class="text-foreground">GraphQL</strong>, <strong class="text-foreground">NestJS</strong>, <strong class="text-foreground">Angular</strong>, and <strong class="text-foreground">MongoDB</strong>, allowing me to adapt quickly to modern tech stacks and contribute across the full development lifecycle.

    <p class="text-muted-foreground leading-relaxed">
    My journey in web development started with a curiosity for creating
    interactive experiences that solve real-world problems. I believe in writing
    clean, maintainable code and staying up-to-date with the latest technologies
    and best practices.

  </p>`,
      // 'Experienced full stack developer with a focus on building scalable web applications. Proficient in modern frameworks and technologies.',
    yearsOfExperience: 6,
    achievements: [
      'Integrated Stripe payment systems for recurring billing, one-time payments, and POS workflows, ensuring PCI-compliant implementations.',
      'Designed and managed multi-database systems using PostgreSQL for relational data and MongoDB for document-based storage, optimizing performance and scalability.',
      'Implemented secure user authentication and role-based access using Auth0, streamlining identity management across applications.',
      'Deployed containerized apps using Docker, reducing environment inconsistencies and improving DevOps workflows.',
      'Integrated custom POS (Point-of-Sale) hardware and software interfaces, improving sales operations and in-store automation.',
      'Built scalable REST APIs and microservices for internal tools and third-party integrations using Express.js and AdonisJS.',
      'Collaborated closely with UI/UX teams using Tailwind CSS and TypeScript, ensuring modern, maintainable frontend codebases.',
    ],
    skills: [
      {
        category: 'frontend',
        lists: [
          'React.js, Next.js, Vue.js, Angular',
          'Tailwind CSS, Sass, Material UI, Shadcn UI, Typescript',
          'HTML5, CSS3, JavaScript (ES6+)',
        ],
      },
      {
        category: 'backend',
        lists: ['Node.js, Express.js, AdonisJS, NestJS', 'MySQL, PostgreSQL, MongoDB', 'REST APIs, GraphQL'],
      },
      {
        category: 'tools',
        lists: [
          'Docker, GitHub Actions, Nginx',
          'AWS (EC2, S3, RDS)',
          'Git, Jira, Figma, VSCode, Slack, Discord',
        ],
      },
    ],
  };
  getAboutInfo(): About {
    return this.about;
  }
}
