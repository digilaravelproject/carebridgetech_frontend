import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isScrolled = false;
  currentRoute: string = '';
  isMobileMenuOpen = false;
  
  // Dynamic navigation items
  navigationItems: any[] = [];
  
  // Static properties that can be made dynamic later
  logo = '/images/logo.svg';
  ctaButtonText = 'Get in Touch';
  
  // Loading state
  isLoading = true;

  constructor(
    private router: Router,
    private contentService: ContentService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
      // Close mobile menu when navigating to new route
      this.isMobileMenuOpen = false;
    });
  }

  ngOnInit() {
    this.loadNavigationMenu();
  }

  loadNavigationMenu() {
    this.contentService.getNavigationMenu('main_navigation').subscribe({
      next: (items) => {
        this.navigationItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading navigation menu:', error);
        this.setDefaultNavigation();
        this.isLoading = false;
      }
    });
  }

  setDefaultNavigation() {
    // Fallback navigation if API fails
    this.navigationItems = [
      { itemKey: 'home', label: 'Home', route: '/home', displayOrder: 1 },
      { itemKey: 'about', label: 'About', route: '/about-us', displayOrder: 2 },
      { itemKey: 'platforms', label: 'Platforms', route: '/product-details', displayOrder: 3 },
      { itemKey: 'services', label: 'Services', route: '#', displayOrder: 4 },
      { itemKey: 'devices', label: 'Devices', route: '/device', displayOrder: 5 },
      { itemKey: 'news', label: 'News', route: '/news', displayOrder: 6 }
    ];
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollY > 100;
  }

}
