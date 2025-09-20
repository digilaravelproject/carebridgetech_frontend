import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  // Dynamic content properties
  heroContent: any = {};
  featuresContent: any = {};
  challengesContent: any = {};
  ecosystemContent: any = {};
  targetAudienceContent: any = {};
  testimonialsContent: any = {};
  companyLogosContent: any = {};
  ctaContent: any = {};
  
  // Dynamic data arrays
  companyLogos: any[] = [];
  targetAudienceTabs: any[] = [];
  
  // Static functionality properties
  activeTab: string = 'clinics';
  
  // Loading and error states
  isLoading = true;
  loadingError = false;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadAllContent();
  }

  loadAllContent() {
    // Load page content
    this.contentService.getPageContent('home').subscribe({
      next: (data) => {
        this.mapContentToProperties(data.content);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading home content:', error);
        this.loadingError = true;
        this.isLoading = false;
        this.setFallbackContent();
      }
    });

    // Load company logos
    this.contentService.getCompanyLogos().subscribe({
      next: (logos) => {
        this.companyLogos = logos;
      },
      error: (error) => {
        console.error('Error loading company logos:', error);
        this.setFallbackLogos();
      }
    });
  }

  mapContentToProperties(content: any) {
    this.heroContent = content.hero || {};
    this.featuresContent = content.features || {};
    this.challengesContent = content.challenges || {};
    this.ecosystemContent = content.ecosystem || {};
    this.targetAudienceContent = content.target_audience || {};
    this.testimonialsContent = content.testimonials || {};
    this.companyLogosContent = content.company_logos || {};
    this.ctaContent = content.cta || {};

    // Parse target audience tabs if they exist as JSON
    if (this.targetAudienceContent.tabs) {
      try {
        this.targetAudienceTabs = JSON.parse(this.targetAudienceContent.tabs);
        if (this.targetAudienceTabs.length > 0) {
          this.activeTab = this.targetAudienceTabs[0].id;
        }
      } catch (e) {
        console.error('Error parsing target audience tabs:', e);
        this.setDefaultTabs();
      }
    } else {
      this.setDefaultTabs();
    }
  }

  setDefaultTabs() {
    this.targetAudienceTabs = [
      {
        id: 'clinics',
        title: 'Clinics',
        img: '/images/benyamin.png',
        desc: 'Improved patient management to grow patient capacity and virtual visits'
      },
      {
        id: 'hospitals',
        title: 'Hospitals',
        img: '/images/benyamin.png',
        desc: 'Better hospital workflows, patient record integration, and digital OPD.'
      },
      {
        id: 'phc',
        title: 'PHC',
        img: '/images/benyamin.png',
        desc: 'Streamlined PHC management and rural health support with telemedicine.'
      },
      {
        id: 'ngo',
        title: 'NGO & Health Camps',
        img: '/images/benyamin.png',
        desc: 'NGOs can manage health camps, patient registration, and follow-ups.'
      },
      {
        id: 'home',
        title: 'Home Care',
        img: '/images/benyamin.png',
        desc: 'Enable home care visits, track vitals, and connect patients to doctors virtually.'
      }
    ];
  }

  setFallbackContent() {
    // Set fallback content for all sections
    this.heroContent = {
      main_title: 'Your Partner In',
      sub_title: 'Remote Health', 
      main_text: 'Monitoring',
      description: 'Empowering healthcare providers and patients with an integrated telemedicine ecosystem—where data, devices, and care converge effortlessly.',
      button_text: 'Know More',
      image: '/images/home-img.png'
    };

    this.featuresContent = {
      section_title: 'Innovating Remote Healthcare,',
      section_subtitle: 'The Carebridge Way',
      feature1_title: 'Integrated Suite of Telehealth Ecosystem',
      feature2_title: 'Future Ready with ABHA and NHDM Compliance',
      feature3_title: 'Real-Time Monitoring & Preventive Care',
      feature4_title: 'Accessible Healthcare Anytime, Anywhere'
    };

    this.companyLogosContent = {
      section_title: 'Trusted by',
      section_subtitle: '10,000+ companies around the world'
    };

    this.setDefaultTabs();
  }

  setFallbackLogos() {
    this.companyLogos = [
      { companyName: 'Google', logoImage: '/images/Google.png' },
      { companyName: 'Facebook', logoImage: '/images/facebook-gray.png' },
      { companyName: 'YouTube', logoImage: '/images/YouTube.png' },
      { companyName: 'Pinterest', logoImage: '/images/Pinterest.png' },
      { companyName: 'Twitch', logoImage: '/images/Twitch.png' },
      { companyName: 'Webflow', logoImage: '/images/Webflow.png' }
    ];
  }

  // Tab functionality
  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  getActiveTabData() {
    return this.targetAudienceTabs.find(tab => tab.id === this.activeTab) || {};
  }

}
