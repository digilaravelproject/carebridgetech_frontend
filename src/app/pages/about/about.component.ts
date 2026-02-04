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
  }

  loadPageContent() {
    this.isLoading = true;
    this.contentService.getAboutPageContent().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.mapContentToProperties(response.data);
        } else if (response && response.content) {
           this.mapContentToProperties(response.content);
        }
        
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
    this.teamLoading = true;
    this.contentService.getTeamMembers().subscribe({
      next: (members) => {
        // Sirf tab load karein agar page content se members nahi mile
        if (this.teamMembers.length === 0) {
            this.teamMembers = members.map(m => ({
                ...m,
                profileImage: this.normalizeImageUrl(m.profileImage)
            }));
        }
        this.teamLoading = false;
      },
      error: (error) => {
        console.error('Error loading team members:', error);
        this.teamLoading = false;
        if (this.teamMembers.length === 0) {
            this.setFallbackTeam();
        }
      }
    });
  }

  mapContentToProperties(content: any) {
    // 1. Header Mapping
    const header = content.header || {};
    this.headerContent = {
        main_title: header.title,
        subtitle: header.subtitle
    };

    // 2. Company Mapping
    const company = content.company || {};
    this.companyContent = {
        description: company.description,
        image: this.normalizeImageUrl(company.image)
    };

    // 3. Mission Mapping
    const mission = content.mission || {};
    // Features array ko clean karna
    const features = (mission.features || []).map((f: any) => ({
        ...f,
        icon: this.normalizeImageUrl(f.icon)
    }));

    this.missionContent = {
        section_title: "We're here for you", 
        section_subtitle: "no matter where you are",
        mission_title: mission.title,
        mission_subtitle: mission.highlight,
        mission_description: mission.description,
        world_map: this.normalizeImageUrl(mission.image), // JSON me mission.image hi world map hai
        features: features
    };

    // 4. Statistics Mapping
    const stats = content.statistics || {};
    this.statisticsContent = {
        section_title: stats.title,
        section_subtitle: stats.highlight,
        section_description: stats.description,
        items: stats.items || []
    };

    // 5. Team Section Mapping
    const team = content.team || {};
    this.teamSectionContent = {
        section_title: team.title,
        section_subtitle: team.highlight,
        section_description: team.description
    };
    
    // Agar API response me hi members hain, to wahin se le lo
    if (team.members && Array.isArray(team.members)) {
        this.teamMembers = team.members.map((m: any) => ({
            ...m,
            profileImage: this.normalizeImageUrl(m.profileImage)
        }));
        this.teamLoading = false;
    } else {
        // Agar nahi hain, to alag se call karo
        this.loadTeamMembers();
    }

    // 6. Contact Mapping
    const contact = content.contact || {};
    this.contactSectionContent = {
        section_label: "Contact us",
        section_title: contact.title,
        section_subtitle: contact.highlight,
        section_description: "Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan.", // Description API me nahi tha, static rakha hai
        email: contact.email,
        phone: contact.phone,
        address: contact.address
    };
  }

  // --- Helper to clean up image URLs (Updated Fix) ---
  private normalizeImageUrl(url: any): string {
    return this.contentService.normalizeImageUrl(url);
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
      features: [
          { title: "Early Detection", description: "Lorem ipsum...", icon: "/images/ImagePlaceholder.png" },
          { title: "Remote Patient", description: "Lorem ipsum...", icon: "/images/ImagePlaceholder.png" },
          { title: "Community Driven", description: "Lorem ipsum...", icon: "/images/ImagePlaceholder.png" }
      ]
    };

    this.statisticsContent = {
      section_title: "Our",
      section_subtitle: "Commitment",
      items: [
          { number: "99", symbol: "%", title: "Satisfaction", description: "Ensuring access." },
          { number: "32", symbol: "M", title: "Users", description: "Powering measurements." },
          { number: "240", symbol: "%", title: "Growth", description: "Accelerating adoption." }
      ]
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
      section_description: "Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan.",
      email: "contact@carebridge.in",
      phone: "+91 9860989899",
      address: "India"
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