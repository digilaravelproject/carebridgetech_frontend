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
  contactDetailsList: any[] = [];
  
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
    this.isLoading = true;
    
    // Load header content (keep existing flow or assume static/different endpoint for header)
    // For now, we'll keep the existing getPageContent for header if it exists, 
    // but primarily we need the contact details from the new endpoint.
    
    // 1. Get Header Content (Optional: from existing 'contact' page content if available)
    this.contentService.getPageContent('contact').subscribe({
      next: (response: any) => {
        const data = response.data || response.content || response;
        if (data && data.header) {
           this.headerContent = {
            title: data.header.title,
            subtitle: data.header.subtitle,
            description: data.header.description
          };
        } else {
             this.setHeaderFallback();
        }
      },
      error: () => {
        this.setHeaderFallback();
      }
    });

    // 2. Get Contact Details List
    this.contentService.getContactDetails().subscribe({
        next: (response: any) => {
             // Response is an array based on user input
            this.contactDetailsList = response;
            this.isLoading = false;
        },
        error: (error) => {
            console.error('Error loading contact details:', error);
            this.isLoading = false;
            // Optionally set fallback/mock data here if needed for testing
             this.contactDetailsList = []; 
        }
    });

  }

  setHeaderFallback() {
    this.headerContent = {
      title: 'Get in',
      subtitle: 'touch today',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan.'
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

  getFormattedAddress(address: string): string {
    if (!address) return '';
    return address.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
  }

  parsePhoneNumbers(phoneNumbers: string): string[] {
    if (!phoneNumbers) return [];
    // Split by slash if multiple numbers are presented like "022-27611193/94"
     // But usually linking the whole string in tel might be tricky if it has slashes. 
     // For display we keep it as is. For href we might need logic.
     // Simple return for display:
     return [phoneNumbers];
  }
}
