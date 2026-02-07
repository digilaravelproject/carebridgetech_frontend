import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
  featuresList: any[] = []; // Added for features loop
  challengesList: any[] = [];
  ecosystemList: any[] = [];
  testimonialsList: any[] = [];
  
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
    // Load page content from specific sync endpoint
    this.contentService.getHomePageContent().subscribe({
      next: (response) => {
        if (response && response.data) {
             this.mapContentToProperties(response.data);
        } else if (response && response.content) {
             this.mapContentToProperties(response.content);
        }
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
        this.companyLogos = logos.map(logo => ({
          ...logo,
          logoImage: this.normalizeImageUrl(logo.logoImage)
        }));
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
    
    // Map features to array
    this.featuresList = [
      { 
        title: this.featuresContent.feature1_title, 
        icon: this.normalizeImageUrl(this.featuresContent.feature1_icon) 
      },
      { 
        title: this.featuresContent.feature2_title, 
        icon: this.normalizeImageUrl(this.featuresContent.feature2_icon) 
      },
      { 
        title: this.featuresContent.feature3_title, 
        icon: this.normalizeImageUrl(this.featuresContent.feature3_icon) 
      },
      { 
        title: this.featuresContent.feature4_title, 
        icon: this.normalizeImageUrl(this.featuresContent.feature4_icon) 
      }
    ];
    
    // Challenges: Map camelCase to snake_case equivalent or usages in template
    const chall = content.challenges || {};
    this.challengesContent = {
        section_title: chall.sectionTitle || 'Remote Healthcare',
        section_subtitle: chall.sectionHighlight || 'Challenges',
        section_description: chall.description
    };
    this.challengesList = chall.items || [];

    // Ecosystem
    const eco = content.ecosystem || {};
    this.ecosystemContent = {
        section_title: eco.sectionTitle || 'End-to-End',
        section_subtitle: eco.sectionHighlight || 'Telemedicine Ecosystem',
        section_description: eco.description
    };
    this.ecosystemList = eco.items || [];

    // Target Audience
    this.targetAudienceContent = content.target_audience || {};
    
    // Testimonials
    const test = content.testimonials || {}; // JSON says null currently
    this.testimonialsContent = {
        section_title: 'What our', // Fallback
        section_subtitle: 'Clients say'
    };
    this.testimonialsList = []; // JSON is null

    // Company Logos
    const logos = content.company_logos || {};
    this.companyLogosContent = {
        section_title: logos.section_title,
        section_subtitle: logos.section_subtitle
    };
    this.companyLogos = logos.logos || [];

    // CTA
    const cta = content.cta || {};
    this.ctaContent = {
        title: cta.title,
        button_text: cta.buttonText, // Map camelCase
        image: this.normalizeImageUrl(cta.image),
        link: cta.buttonLink
    };

    // Parse target audience tabs
    if (this.targetAudienceContent.tabs) {
       // The API returns distinct objects in 'tabs' array directly
       if (Array.isArray(this.targetAudienceContent.tabs)) {
           this.targetAudienceTabs = this.targetAudienceContent.tabs;
       } else {
           // If somehow stringified
           try {
              this.targetAudienceTabs = JSON.parse(this.targetAudienceContent.tabs);
           } catch(e) { this.setDefaultTabs(); }
       }
       
       if (this.targetAudienceTabs.length > 0) {
          this.activeTab = this.targetAudienceTabs[0].id;
       }
    } else {
      this.setDefaultTabs();
    }
  }



  // Helper now used from ContentService directly where needed, 
  // or via this wrapper if we want to keep calling syntax same
  private normalizeImageUrl(url: any): string {
    return this.contentService.normalizeImageUrl(url);
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

    this.featuresList = [
        { title: 'Integrated Suite of Telehealth Ecosystem', icon: '/uploads/content/1770188901874-1.svg' },
        { title: 'Future Ready with ABHA and NHDM Compliance', icon: '/uploads/content/1770188901874-1.svg' }, // Placeholder fallback
        { title: 'Real-Time Monitoring & Preventive Care', icon: '/uploads/content/1770188901874-1.svg' }, 
        { title: 'Accessible Healthcare Anytime, Anywhere', icon: '/uploads/content/1770188901874-1.svg' }
    ];

    this.challengesContent = {
        section_title: 'Remote Healthcare',
        section_subtitle: 'Challenges',
        section_description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan.'
    };
    
    // Add default lists if API doesn't provide them yet
    this.challengesList = [
        { id: '01', title: 'Access Gaps', description: 'Millions of patients struggle to access specialist care due to geographical barriers, and limited availability of healthcare professionals in rural areas' },
        { id: '02', title: 'Resource Strain', description: 'Healthcare facilities are overwhelmed with inefficient scheduling systems, and staff shortages, leading to burnout and compromised patient care quality' },
        { id: '03', title: 'Data Silos', description: 'Patient information remains fragmented across multiple systems, creating incomplete medical histories, duplicate tests, and delayed treatment' }
    ];

    this.ecosystemContent = {
        section_title: 'End-to-End',
        section_subtitle: 'Telemedicine Ecosystem',
        section_description: 'From connected monitoring devices to a secure patient-data platform and on-demand clinical support, Carebridge Technologies delivers everything you need to scale remote care—seamlessly'
    };

    this.ecosystemList = [
         { title: 'Platforms', description: 'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper dalaracc lacus vel facilisis.', image: '/images/desktop-mockup.svg', link: '#' },
         { title: 'Devices', description: 'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper.', image: '/images/bundle.svg', link: '#' },
         { title: 'Services', description: 'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper.', image: '/images/mobile-mockup.svg', link: '#' }
    ];

    this.testimonialsContent = {
        section_title: 'What our',
        section_subtitle: 'Clients say',
        section_description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan.'
    };

    this.testimonialsList = [
        { quote: 'An amazing service', text: 'Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.', author: 'John Carter', position: 'Designer at BRIX Templates', image: '/images/profile.svg' },
        { quote: 'One of a kind service', text: 'Ultrices eros in cursus turpis massa tincidunt sem nulla pharetra diam sit amet nisl suscipit adipis.', author: 'Sophie Moore', position: 'Head of Design at BRIX Templates', image: '/images/profile.svg' },
        { quote: 'The best service', text: 'Convallis posuere morbi leo urna molestie at elementum eu facilisis sapien pellentesque habitant.', author: 'Andy Smith', position: 'Developer at BRIX Templates', image: '/images/profile.svg' }
    ];

    this.ctaContent = {
        title: 'Create your account today and get started for free!',
        button_text: 'Get in Touch',
        image: '/images/home-image.svg'
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
