import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  // Dynamic content properties
  headerContent: any = {};
  contactDetailsContent: any = {};
  
  // Form handling
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  
  // Loading states
  isLoading = true;

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
    this.contentService.getPageContent('contact').subscribe({
      next: (response: any) => {
        // Handle potentially different response structures
        const data = response.data || response.content || response;
        this.mapContentToProperties(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading contact content:', error);
        this.isLoading = false;
        this.setFallbackContent();
      }
    });
  }

  mapContentToProperties(content: any) {
    // 1. Header
    const header = content.header || {};
    this.headerContent = {
        title: header.title,
        subtitle: header.subtitle,
        description: header.description
    };

    // 2. Contact Details
    // API might return 'contact' or 'contact_details'
    const contact = content.contact || content.contact_details || {};
    
    this.contactDetailsContent = {
        section_title: contact.section_title || contact.title || 'Contact details',
        
        location_label: contact.location_label || contact.address_label || 'Our location',
        location_value: contact.location_value || contact.address || contact.location,
        
        phone_label: contact.phone_label || 'Call us',
        phone_value: contact.phone_value || contact.phone,
        
        email_label: contact.email_label || 'Email us',
        email_value: contact.email_value || contact.email
    };
  }

  setFallbackContent() {
    this.headerContent = {
      title: 'Get in',
      subtitle: 'touch today',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan.'
    };
    this.contactDetailsContent = {
      section_title: 'Contact details',
      location_label: 'Our location',
      location_value: '58 Middle Point Rd\nSan Francisco, 94124',
      phone_label: 'Call us',
      phone_value: '(123) 456 - 789',
      email_label: 'Email us',
      email_value: 'contact@company.com'
    };
  }

  onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = false;
      
      this.contentService.submitContactForm(this.contactForm.value).subscribe({
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
          this.submitError = true;
          this.isSubmitting = false;
        }
      });
    }
  }

  getFormattedLocation(): string {
    const location = this.contactDetailsContent.location_value || '';
    return location.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
  }

  getPhoneHref(): string {
    const phone = this.contactDetailsContent.phone_value || '';
    return 'tel:' + phone.replace(/[^0-9+]/g, '');
  }

  getEmailHref(): string {
    const email = this.contactDetailsContent.email_value || '';
    return 'mailto:' + email;
  }
}
