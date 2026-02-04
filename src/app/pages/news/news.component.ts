import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/content.service';

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  authorPosition?: string;
  authorCompany?: string;
  featured?: boolean;
  videoUrl?: string;
}

export interface NewsMainSection {
  heading: string;
  headingHighlight: string;
  description: string;
}

export interface FeaturedArticle {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  authorPosition?: string;
  authorCompany?: string;
  companyLogoUrl?: string;
  videoUrl?: string;
}

export interface SocialSection {
  heading: string;
  headingHighlight: string;
  description: string;
  buttonText: string;
  socialMediaLink: string;
}

export interface NewsPageContent {
  mainSection: NewsMainSection;
  featuredArticle: FeaturedArticle | null;
  socialSection: SocialSection;
  newsArticles: NewsArticle[];
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  selectedCategory: string = 'All';
  
  // Dynamic header content
  newsHeading: string = 'Latest';
  newsHeadingHighlight: string = 'News & Updates';
  newsDescription: string = 'Stay updated with the latest healthcare technology innovations, research breakthroughs, and company announcements.';
  
  // LinkedIn section content
  linkedinHeading: string = 'Follow us on';
  linkedinHeadingHighlight: string = 'Linkedin';
  linkedinDescription: string = 'Explore our collection of healthcare technology articles, research papers, and industry updates.';
  
  followButtonText: string = 'Follow Us';
  socialMediaLink: string = 'https://www.linkedin.com/company/carebridge-health';
  
  featuredArticle: FeaturedArticle = {
    id: 1,
    title: 'Facebook Partners with Carebridge for Healthcare Innovation',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Vel mauris turpis vel eget nec orci nec ipsum Elementum felis eu pellentesque velit vulputate. Blandit consequat facilisi sagittis ut quis Integer et faucibus elemen.',
    imageUrl: '/images/news-img.svg',
    author: 'John Carter',
    authorPosition: 'Creative Director',
    authorCompany: 'Facebook',
    videoUrl: 'https://example.com/video'
  };

  newsArticles: NewsArticle[] = [];
  
  // Loading states
  isLoading: boolean = true;
  loadingError: boolean = false;
  
  constructor(private contentService: ContentService) {}
  
  ngOnInit(): void {
    this.loadNewsPageContent();
  }
  
  loadNewsPageContent(): void {
    this.contentService.getNewsPageContent().subscribe({
      next: (data) => {
        this.updatePageContent(data);
        this.isLoading = false;
      },
      error: (error) => {
        this.loadingError = true;
        this.isLoading = false;
        this.setFallbackContent();
      }
    });
  }
  
  updatePageContent(data: NewsPageContent): void {
    // Main section
    if (data.mainSection) {
      this.newsHeading = data.mainSection.heading;
      this.newsHeadingHighlight = data.mainSection.headingHighlight;
      this.newsDescription = data.mainSection.description;
    }
    
    // Featured article
    if (data.featuredArticle) {
        this.featuredArticle = {
            ...data.featuredArticle,
            imageUrl: this.normalizeImageUrl(data.featuredArticle.imageUrl),
            companyLogoUrl: this.normalizeImageUrl(data.featuredArticle.companyLogoUrl)
        };
    }
    
    // Social section
    if (data.socialSection) {
      this.linkedinHeading = data.socialSection.heading;
      this.linkedinHeadingHighlight = data.socialSection.headingHighlight;
      this.linkedinDescription = data.socialSection.description;
      this.followButtonText = data.socialSection.buttonText;
      this.socialMediaLink = data.socialSection.socialMediaLink;
    }
    
    // News articles
    if (data.newsArticles && data.newsArticles.length > 0) {
      this.newsArticles = data.newsArticles.map(article => ({
        ...article,
        imageUrl: this.normalizeImageUrl(article.imageUrl)
      }));
    }
  }

  // Helper to clean up image URLs
  private normalizeImageUrl(url: any): string {
    return this.contentService.normalizeImageUrl(url);
  }
  
  setFallbackContent(): void {
    // Main section
    this.newsHeading = 'Latest';
    this.newsHeadingHighlight = 'News & Updates';
    this.newsDescription = 'Stay updated with the latest healthcare technology innovations, research breakthroughs, and company announcements.';
    
    // LinkedIn section
    this.linkedinHeading = 'Follow us on';
    this.linkedinHeadingHighlight = 'Linkedin';
    this.linkedinDescription = 'Explore our collection of healthcare technology articles, research papers, and industry updates.';
    this.followButtonText = 'Follow Us';
    this.socialMediaLink = 'https://www.linkedin.com/company/carebridge-health';
    
    // Featured article
    this.featuredArticle = {
      id: 1,
      title: 'Facebook Partners with Carebridge for Healthcare Innovation',
      content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Vel mauris turpis vel eget nec orci nec ipsum Elementum felis eu pellentesque velit vulputate. Blandit consequat facilisi sagittis ut quis Integer et faucibus elemen.',
      imageUrl: '/images/news-img.svg',
      author: 'John Carter',
      authorPosition: 'Creative Director',
      authorCompany: 'Facebook',
      videoUrl: 'https://example.com/video'
    };

    // News articles
    this.newsArticles = [
      {
        id: 2,
        title: 'New Healthcare Device Launch',
        summary: 'Carebridge announces revolutionary monitoring system',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at lacinia ex, in mollis lectus.',
        imageUrl: '/images/img-1.png',
        author: 'Sarah Johnson',
      },
      {
        id: 3,
        title: 'Annual Healthcare Conference',
        summary: 'Join us for the biggest healthcare event of the year',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at lacinia ex, in mollis lectus.',
        imageUrl: '/images/img-2.png',
        author: 'Michael Brown',
      },
      {
        id: 4,
        title: 'Research Breakthrough in Patient Care',
        summary: 'New study shows promising results for remote patient monitoring',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at lacinia ex, in mollis lectus.',
        imageUrl: '/images/img-3.png',
        author: 'Dr. Emily Chen',
      },
      {
        id: 5,
        title: 'Technology Integration Partnership',
        summary: 'Carebridge partners with leading tech companies',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at lacinia ex, in mollis lectus.',
        imageUrl: '/images/img-4.png',
        author: 'David Wilson',
      }
    ];
  }
}
