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

    // 1. Extract the raw string if it's wrapped in an array or is a string
    let raw = '';
    if (Array.isArray(images) && images.length > 0) {
        raw = typeof images[0] === 'string' ? images[0] : '';
    } else if (typeof images === 'string') {
        raw = images;
    }

    // 2. Process the raw string
    if (raw) {
       // Check for garbage prefix like http://... before the quotes
       // Pattern to match: possibly some text, then a quote, then the paths, then a quote
       // But messy format might be: BaseUrl + "Path\r\nPath"
       
       // Strategy: Remove all quotes first? No, paths might handle spaces, but we assume file paths.
       // The snippet: http://api.localhost:3000"/uploads...
       // Let's strip quotes.
       // And split by \r\n
       
       const parts = raw.split(/\\r\\n|\r\n/);
       
       parsedImages = parts.map(p => {
           // Clean up the part
           let clean = p.trim();
           // Remove leading/trailing quotes
           clean = clean.replace(/^"|"$/g, '');
           // Remove escaped quotes
           clean = clean.replace(/\\"/g, '"');
           
           // Remove potentially duplicated Base URL prefix attached to the first item weirdly
           // Example: http://api.localhost:3000"/uploads/foo.png -> http://api.localhost:3000/uploads/foo.png
           // But wait, if we stripped quotes, it became http://api.localhost:3000/uploads/foo.png.
           // That is a valid URL! 
           // BUT subsequent items might be just /uploads/foo.png.
           
           return this.normalizeImageUrl(clean);
       }).filter(p => p.length > 0 && !p.match(/^["]+$/)); // Filter out empty or quote-only entries
    }

    // 3. Fallback to main image
    if (parsedImages.length === 0 && mainImage) {
        parsedImages = [this.normalizeImageUrl(mainImage)];
    } else if (parsedImages.length === 0) {
        parsedImages = ['/images/ImagePlaceholder.png'];
    }

    // 4. Ensure exactly 4 images for the gallery layout (User requirement: "mujeh waha 4 images chaiye")
    const targetCount = 4;
    // Remove duplicates if any
    parsedImages = [...new Set(parsedImages)];
    
    if (parsedImages.length > 0 && parsedImages.length < targetCount) {
        const originalLength = parsedImages.length;
        // Fill up to targetCount by cycling
        for (let i = 0; i < targetCount - originalLength; i++) {
             parsedImages.push(parsedImages[i % originalLength]);
        }
    } 
    // If we have more than 4, shouldn't we keep them? 
    // User said "waha 4 images chaiye", maybe they meant *at least* 4 slots filled?
    // Let's keep all if more than 4, but ensure at least 4.
    
    return parsedImages;
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
