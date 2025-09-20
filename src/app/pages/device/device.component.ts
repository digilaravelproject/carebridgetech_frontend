import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperModule, } from 'swiper/angular';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { ContentService } from '../../services/content.service';
SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule, SwiperModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss'
})
export class DeviceComponent implements OnInit {

  // Dynamic content
  categoriesContent: any = {};
  products: any = {};
  
  // Component state
  activeTab: string = 'devices'; // lowercase to match API
  isLoading = true;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadContent();
    this.loadProducts();
  }

  loadContent() {
    this.contentService.getPageContent('device').subscribe({
      next: (data) => {
        this.categoriesContent = data.content['categories'] || {};
      },
      error: (error) => {
        console.error('Error loading device content:', error);
        this.setFallbackContent();
      }
    });
  }

  loadProducts() {
    this.contentService.getProducts().subscribe({
      next: (data) => {
        this.products = data.productsByCategory || {};
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
        this.setFallbackProducts();
      }
    });
  }

  setFallbackContent() {
    this.categoriesContent = {
      devices_label: 'Devices',
      kiosks_label: 'Kiosks',
      kits_label: 'Kits'
    };
  }

  setFallbackProducts() {
    this.products = {
      devices: [
        {
          id: 1,
          productName: "MR 300",
          specifications: [
            "5\" Color TFT display",
            "12 Leads simultaneous ECG acquisition",
            "3 Channel ECG Recording",
            "Interpretation Facility",
            "Memory storage for 5 patients",
            "Auto & Manual mode of operation",
            "PDF convertor to transfer ECG from device to USB",
            "Display of 12 Lead ECG waveform",
            "ECG lead annotation facility"
          ],
          mainImage: "/images/ImagePlaceholder.png",
          galleryImages: [
            "/images/ImagePlaceholder.png",
            "/images/ImagePlaceholder.png"
          ],
          brochureUrl: null
        }
      ],
      kiosks: [],
      kits: []
    };
  }

  setActive(tab: string) {
    this.activeTab = tab.toLowerCase();
  }

  getProductsForCategory(category: string) {
    return this.products[category] || [];
  }

  trackByProductId(index: number, product: any): number {
    return product.id;
  }

  downloadBrochure(brochureUrl: string) {
    if (brochureUrl) {
      window.open(brochureUrl, '_blank');
    }
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
    navigation: {
      nextEl: '.swiper-next',
      prevEl: '.swiper-prev',
    },
  };

  carouselConfig1: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 12,
    autoplay: { delay: 2000 },
    pagination: { clickable: true },
    navigation: {
      nextEl: '.swiper-next1',
      prevEl: '.swiper-prev1'
    }
  };

  carouselConfig2: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 12,
    autoplay: { delay: 3000 },
    pagination: { clickable: true },
    navigation: {
      nextEl: '.swiper-next2',
      prevEl: '.swiper-prev2'
    }
  };

}
