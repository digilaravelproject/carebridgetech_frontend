import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperModule, } from 'swiper/angular';
import SwiperCore, { Pagination } from 'swiper';
SwiperCore.use([ Pagination]);

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, SwiperModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

  activeTab: string = 'Consensus';

  setActive(tab: string) {
    this.activeTab = tab;
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
