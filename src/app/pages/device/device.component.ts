import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperModule, } from 'swiper/angular';
import SwiperCore, { Pagination, Navigation } from 'swiper';
SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule, SwiperModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss'
})
export class DeviceComponent {

  activeTab: string = 'Devices';

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
