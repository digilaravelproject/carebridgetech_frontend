import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwiperOptions } from 'swiper';
import { SwiperModule, } from 'swiper/angular';
import SwiperCore, { Pagination } from 'swiper';
import { ContentService, PlatformData } from '../../services/content.service';
SwiperCore.use([ Pagination]);

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, SwiperModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  activeTab: string = '';
  platforms: PlatformData[] = [];
  
  isLoading = true;
  loadingError = false;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.contentService.getAllProductDetailsData().subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.platforms) {
          this.platforms = response.data.platforms;

          if (this.platforms.length > 0) {
            this.activeTab = this.platforms[0].id;
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
    return this.platforms.find(p => p.id === this.activeTab);
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
