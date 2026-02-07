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

  categoryKeys: string[] = []; // New property for dynamic tabs

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
        const rawProducts = data.productsByCategory || {};
        // Process products to fix malformed data
        this.products = {};
        Object.keys(rawProducts).forEach(key => {
            this.products[key] = rawProducts[key].map((product: any) => ({
                ...product,
                specifications: this.parseSpecifications(product.specifications),
                galleryImages: this.parseGalleryImages(product.galleryImages, product.mainImage)
            }));
        });

        this.categoryKeys = Object.keys(this.products); // Derive keys
        if (this.categoryKeys.length > 0) {
          this.activeTab = this.categoryKeys[0];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
        this.setFallbackProducts();
        this.categoryKeys = Object.keys(this.products); // Fallback keys
        if (this.categoryKeys.length > 0) {
            this.activeTab = this.categoryKeys[0]; 
        }
      }
    });
  }

  // Helper to parse specifications string/array
  parseSpecifications(specs: any): string[] {
    if (!specs) return [];
    
    // If it's already an array of clean strings, return it (but check if 1st element is the malformed string)
    if (Array.isArray(specs)) {
        if (specs.length === 0) return [];
        // Check if the first element looks like the malformed string
        if (typeof specs[0] === 'string' && (specs[0].includes('\\r\\n') || specs[0].includes('\r\n') || specs[0].startsWith('"'))) {
            return this.parseStringifiedList(specs[0]);
        }
        return specs;
    }
    
    if (typeof specs === 'string') {
        return this.parseStringifiedList(specs);
    }

    return [];
  }

  // Helper to parse stringified list with newlines
  private parseStringifiedList(raw: string): string[] {
    try {
        // Remove outer quotes if present (e.g. "content")
        let cleaned = raw;
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
            cleaned = cleaned.slice(1, -1);
        }
        // Unescape quotes like \" -> "
        cleaned = cleaned.replace(/\\"/g, '"');
        
        // Split by \r\n or \\r\\n
        return cleaned.split(/\\r\\n|\r\n/).map(s => s.trim()).filter(s => s.length > 0);
    } catch (e) {
        console.error('Error parsing specs:', e);
        return [raw];
    }
  }

  setActive(tab: string) {
    this.activeTab = tab;
  }

  getProductsForCategory(category: string) {
    // Try exact match first
    if (this.products[category]) {
      return this.products[category];
    }
    // Try case-insensitive fallback look up
    const key = Object.keys(this.products).find(k => k.toLowerCase() === category.toLowerCase());
    return key ? this.products[key] : [];
  }

  // Helper to parse gallery images
  parseGalleryImages(images: any, mainImage: string): string[] {
    let parsedImages: string[] = [];

    // 1. Always start with the main image if available
    if (mainImage) {
        const cleanMain = this.normalizeImageUrl(mainImage);
        if (cleanMain) {
            parsedImages.push(cleanMain);
        }
    }

    // 2. Parse the gallery images input
    if (Array.isArray(images)) {
        images.forEach(img => {
            if (typeof img === 'string') {
               // Handle potential newline separated strings just in case
               if (img.includes('\r\n') || img.includes('\\r\\n')) {
                    const parts = img.split(/\\r\\n|\r\n/);
                    parts.forEach(p => {
                       const clean = this.cleanUrlString(p);
                       if (clean) parsedImages.push(clean);
                    });
               } else {
                   const clean = this.cleanUrlString(img);
                   if (clean) parsedImages.push(clean);
               }
            }
        });
    } else if (typeof images === 'string') {
         // Handle string input
         if (images.includes('\r\n') || images.includes('\\r\\n')) {
             const parts = images.split(/\\r\\n|\r\n/);
             parts.forEach(p => {
                const clean = this.cleanUrlString(p);
                if (clean) parsedImages.push(clean);
             });
         } else {
             const clean = this.cleanUrlString(images);
             if (clean) parsedImages.push(clean);
         }
    }

    // 3. Keep all images (Removed deduplication for testing/user request)
    // parsedImages = [...new Set(parsedImages)];
    
    // 4. Fallback if no images at all
    if (parsedImages.length === 0) {
        parsedImages = ['/images/ImagePlaceholder.png'];
    }

    return parsedImages;
  }

  private cleanUrlString(raw: string): string {
      let clean = raw.trim();
      clean = clean.replace(/^"|"$/g, '').replace(/\\"/g, '"');
      if (clean.length > 0 && !clean.match(/^["]+$/)) {
          return this.normalizeImageUrl(clean);
      }
      return '';
  }

  private normalizeImageUrl(url: string): string {
    return this.contentService.normalizeImageUrl(url);
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
