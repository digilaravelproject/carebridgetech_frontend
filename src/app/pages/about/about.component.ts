import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  // Dynamic content properties
  headerContent: any = {};
  companyContent: any = {};
  missionContent: any = {};
  statisticsContent: any = {};
  teamSectionContent: any = {};
  contactSectionContent: any = {};
  
  // Dynamic data
  teamMembers: any[] = [];
  
  // Form handling
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  
  // Loading states
  isLoading = true;
  teamLoading = true;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPageContent();
    this.loadTeamMembers();
  }

  loadPageContent() {
    this.contentService.getPageContent('about').subscribe({
      next: (data) => {
        this.mapContentToProperties(data.content);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading about content:', error);
        this.isLoading = false;
        this.setFallbackContent();
      }
    });
  }

  loadTeamMembers() {
    this.contentService.getTeamMembers().subscribe({
      next: (members) => {
        this.teamMembers = members;
        this.teamLoading = false;
      },
      error: (error) => {
        console.error('Error loading team members:', error);
        this.teamLoading = false;
        this.setFallbackTeam();
      }
    });
  }

  mapContentToProperties(content: any) {
    this.headerContent = content.header || {};
    this.companyContent = content.company || {};
    this.missionContent = content.mission || {};
    this.statisticsContent = content.statistics || {};
    this.teamSectionContent = content.team || {};
    this.contactSectionContent = content.contact || {};
  }

  setFallbackContent() {
    this.headerContent = {
      main_title: "We're here to",
      subtitle: "guarantee your success"
    };
    
    this.companyContent = {
      description: "At Carebridge Technologies, a subsidiary of Maestros Electronics, we're driven by one goal: to connect people to care—anywhere, anytime.",
      image: "/images/untitled.png"
    };

    this.missionContent = {
      section_title: "We're here for you",
      section_subtitle: "no matter where you are",
      world_map: "/images/WorldMap.png",
      mission_title: "Our",
      mission_subtitle: "Mission",
      mission_description: "Build a wellness ecosystem that empowers individuals, eases the burden on healthcare systems, and catches risks before they become crises.",
      feature1_title: "Early Detection of Disease",
      feature1_description: "Lorem ipsum dolor sit amet consecte tur adipiscing elit semper dalar cons elementum tempus hac.",
      feature1_icon: "/images/ImagePlaceholder.png",
      feature2_title: "Remote Patient Management",
      feature2_description: "Lorem ipsum dolor sit amet consecte turole adipiscing elit semper dalaracc lacus velolte facilisis volutpat est velitolm.",
      feature2_icon: "/images/ImagePlaceholder.png",
      feature3_title: "Community-Driven Wellness",
      feature3_description: "Lorem ipsum dolor sit amet consecte turole adipiscing elit semper dalaracc lacus velolte facilisis volutpat est velitolm.",
      feature3_icon: "/images/ImagePlaceholder.png"
    };

    this.statisticsContent = {
      section_title: "Our",
      section_subtitle: "Commitment",
      stat1_number: "99",
      stat1_symbol: "%",
      stat1_title: "Customer satisfaction",
      stat1_description: "Ensuring uninterrupted access for every user.",
      stat2_number: "32",
      stat2_symbol: "M",
      stat2_title: "Active users",
      stat2_description: "Powering millions of health measurements daily.",
      stat3_number: "240",
      stat3_symbol: "%",
      stat3_title: "Company growth",
      stat3_description: "Accelerating adoption across clinics and enterprises."
    };

    this.teamSectionContent = {
      section_title: "Meet our",
      section_subtitle: "team members",
      section_description: "Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat gravida malesuada quam commodo id integer nam."
    };

    this.contactSectionContent = {
      section_label: "Contact us",
      section_title: "Get in",
      section_subtitle: "touch today",
      section_description: "Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan."
    };
  }

  setFallbackTeam() {
    this.teamMembers = [
      {
        id: 1,
        name: "John Carter",
        position: "CEO & Co-Founder",
        bio: "Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.",
        profileImage: "/images/profile.svg",
        socialLinks: {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: ""
        }
      }
    ];
  }

  onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      this.contentService.submitAboutForm(this.contactForm.value).subscribe({
        next: (response) => {
          this.submitSuccess = true;
          this.contactForm.reset();
          this.isSubmitting = false;
          setTimeout(() => {
            this.submitSuccess = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}
