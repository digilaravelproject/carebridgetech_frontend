import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperModule, } from 'swiper/angular';
import SwiperCore, { Pagination } from 'swiper';
import { ContentService } from '../../services/content.service';
SwiperCore.use([ Pagination]);

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, SwiperModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  activeTab: string = '';
  platforms: any[] = [];
  deploymentOptions: any[] = [];
  solutions: any[] = [];
  ctaSections: any[] = [];
  
  isLoading = true;
  loadingError = false;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.contentService.getAllProductDetailsData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.deploymentOptions = response.data.deploymentOptions || [];
          this.solutions = response.data.solutions || [];
          this.ctaSections = response.data.ctaSections || [];
          
          // Map platforms and attach related data for easier use in template
          this.platforms = (response.data.platforms || []).map((platform: any) => {
             return {
               ...platform,
               key: platform.id, // Ensure key matches id
               // Map feature to features_box expected by template
               features_box: platform.feature ? platform.feature : null, 
               // Attach deployment options
               deployment_options: this.deploymentOptions.filter(d => d.applicableTabs && d.applicableTabs.includes(platform.id)),
               // Attach solutions
               solutions: this.solutions.filter(s => s.platformId === platform.id),
               // Attach CTA data
               cta_title: this.ctaSections.find(c => c.platformId === platform.id)?.title,
               cta_description: this.ctaSections.find(c => c.platformId === platform.id)?.description,
               cta_button: this.ctaSections.find(c => c.platformId === platform.id)?.buttonText,
               gallery: platform.images
             };
          });

          if (this.platforms.length > 0) {
            this.activeTab = this.platforms[0].key;
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product details:', error);
        this.loadingError = true;
        this.isLoading = false;
      }
    });
  }

  setActive(tab: string) {
    this.activeTab = tab;
  }

  get activePlatform() {
    return this.platforms.find(p => p.key === this.activeTab);
  }

  carouselConfig: SwiperOptions = {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 12,
    loop: false,
    lazy: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false
    },
    pagination: {
      clickable: true
    },
    breakpoints: {
      0: {
        spaceBetween: 12,
        slidesPerView: 1,
      }
    }
  };

}
