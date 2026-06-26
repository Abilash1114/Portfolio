import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type ProjectCardCategory = 'Fintech' | 'Website' | '0 to 1 Concept';

interface ProjectCard {
  id: string;
  title: string;
  category: ProjectCardCategory;
  href: string;
  img: string;
}

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.css'],
})
export class WorksComponent {
  readonly cardFilters: Array<'All' | ProjectCardCategory> = [
    'All',
    'Fintech',
    'Website',
    '0 to 1 Concept',
  ];
  activeCardFilter: 'All' | ProjectCardCategory = 'All';

  readonly projectCards: ProjectCard[] = [
    {
      id: '01',
      title: 'Interview AI',
      category: '0 to 1 Concept',
      href: 'https://www.behance.net/gallery/251770687/InterviewAI-AI-Mock-Interview-App-Product-Design',
      img: 'assets/images/project 1.png',
    },
    {
      id: '02',
      title: 'Paisa Pop',
      category: 'Fintech',
      href: 'https://www.behance.net/gallery/238250743/Paisa-Pop-Loan-App-Redesign-UXUI-Case-Study',
      img: 'assets/images/project 2.png',
    },
    {
      id: '03',
      title: 'Crompton (Redesign)',
      category: 'Website',
      href: 'https://www.behance.net/gallery/249344303/Future-of-Home-Appliances-Crompton-Redesign',
      img: 'assets/images/project 3.png',
    },
    {
      id: '04',
      title: 'Digi Wallet',
      category: 'Fintech',
      href: 'https://www.behance.net/gallery/235183431/Secure-Digital-Wallet-Buy-Gold-App-(UIUX-Case-Study)',
      img: 'assets/images/project 4.png',
    },
    {
      id: '05',
      title: 'Redesigned IRCTC',
      category: 'Website',
      href: 'https://www.behance.net/gallery/238549091/IRCTC-Website-Redesign',
      img: 'assets/images/project 5.png',
    },
    {
      id: '06',
      title: 'InfoPlus (Redesign)',
      category: 'Website',
      href: 'https://www.behance.net/gallery/238251613/Corporate-Website-Redesign-InfoPlus-Homepage-UXUI',
      img: 'assets/images/project 6.png',
    },
    {
      id: '07',
      title: 'Food App',
      category: '0 to 1 Concept',
      href: 'https://www.behance.net/gallery/233455293/ForkPay-The-Smarter-Way-to-Dine-Pay',
      img: 'assets/images/project 7.png',
    },
    {
      id: '08',
      title: 'InfoPlus (Redesign)',
      category: 'Website',
      href: 'https://www.behance.net/gallery/238251613/Corporate-Website-Redesign-InfoPlus-Homepage-UXUI',
      img: 'assets/images/project 8.png',
    },
  ];

  get filteredProjectCards(): ProjectCard[] {
    return this.activeCardFilter === 'All'
      ? this.projectCards
      : this.projectCards.filter((p) => p.category === this.activeCardFilter);
  }

  setCardFilter(cat: 'All' | ProjectCardCategory): void {
    this.activeCardFilter = cat;
  }
}
