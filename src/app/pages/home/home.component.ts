import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

   activeTab: string = 'clinics';

  tabs = [
    {
      id: 'clinics',
      title: 'Clinics',
      img: '/images/benyamin.png',
      desc: 'Improved patient management to grow patient capacity and virtual visits',
    },
    {
      id: 'hospitals',
      title: 'Hospitals',
      img: '/images/benyamin.png',
      desc: 'Better hospital workflows, patient record integration, and digital OPD.',
    },
    {
      id: 'phc',
      title: 'PHC',
      img: '/images/benyamin.png',
      desc: 'Streamlined PHC management and rural health support with telemedicine.',
    },
    {
      id: 'ngo',
      title: 'NGO & Health Camps',
      img: '/images/benyamin.png',
      desc: 'NGOs can manage health camps, patient registration, and follow-ups.',
    },
    {
      id: 'home',
      title: 'Home Care',
      img: '/images/benyamin.png',
      desc: 'Enable home care visits, track vitals, and connect patients to doctors virtually.',
    },
  ];

}
