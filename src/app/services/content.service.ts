import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NewsPageContent } from '../pages/news/news.component';
import { environment } from '../../environments/environment';

// Interfaces matching the provided JSON structure
export interface SectionTitle {
  main: string;
  highlight?: string;
}

export interface SectionContent {
  title: SectionTitle | string;
  image?: string;
  description?: string;
}

export interface PlatformSections {
  howItWorks?: SectionContent;
  achieve?: { title: SectionTitle };
  targetAudience?: { title: SectionTitle };
  deployment?: { title: SectionTitle };
  solutions?: { title: SectionTitle };
}

export interface Achievement {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface TargetAudience {
  id: number;
  image: string;
  title: string;
  description: string;
}

export interface DeploymentOption {
  id: number;
  icon: string;
  title: string;
}

export interface PlatformFeature {
  icon: string;
  title: string;
  description: string;
}

export interface PlatformCTA {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface Solution {
  id: number;
  image: string;
  title: string;
  description: string;
}

export interface PlatformData {
  id: string;
  name: string;
  logo: string;
  description: string;
  feature?: PlatformFeature;
  images: string[];
  solutions: Solution[];
  cta: PlatformCTA;
  sections: PlatformSections;
  achievements: Achievement[];
  targetAudiences: TargetAudience[];
  deploymentOptions: DeploymentOption[];
}

export interface ProductDetailsResponse {
  success: boolean;
  data: {
    platforms: PlatformData[];
  };
}

export interface ContentSection {
  [key: string]: any;
}

export interface PageContent {
  pageKey: string;
  content: { [sectionKey: string]: ContentSection };
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = environment.apiUrl;
  private contentCache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  // Get all content for a page
  getPageContent(pageKey: string): Observable<PageContent> {
    // Check cache first
    if (this.contentCache.has(pageKey)) {
      return of(this.contentCache.get(pageKey));
    }

    return this.http.get<PageContent>(`${this.apiUrl}/content/${pageKey}`).pipe(
      map(data => {
        this.contentCache.set(pageKey, data);
        return data;
      }),
      catchError(error => {
        console.error(`Error loading content for ${pageKey}:`, error);
        throw error;
      })
    );
  }

  // Get contact details
  getContactDetails(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/contact`);
  }

  // Get specific section content
  getSectionContent(pageKey: string, sectionKey: string): Observable<ContentSection> {
    return this.http.get<{content: ContentSection}>(`${this.apiUrl}/content/${pageKey}/${sectionKey}`).pipe(
      map(response => response.content)
    );
  }

  // Get team members
  getTeamMembers(): Observable<any[]> {
    return this.http.get<{teamMembers: any[]}>(`${this.apiUrl}/team`).pipe(
      map(response => response.teamMembers)
    );
  }

  // Get products by category
  getProducts(category?: string): Observable<any> {
    const url = category ? `${this.apiUrl}/products/${category}` : `${this.apiUrl}/products`;
    return this.http.get<any>(url);
  }

  // Get company logos
  getCompanyLogos(): Observable<any[]> {
    return this.http.get<{companyLogos: any[]}>(`${this.apiUrl}/logos`).pipe(
      map(response => response.companyLogos)
    );
  }

  // Get navigation menu items
  getNavigationMenu(menuKey: string = 'main_navigation'): Observable<any[]> {
    return this.http.get<{items: any[]}>(`${this.apiUrl}/navigation/${menuKey}`).pipe(
      map(response => response.items)
    );
  }

  // Submit contact form
  submitContactForm(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forms/contact`, formData);
  }

  // Submit about form
  submitAboutForm(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forms/about`, formData);
  }

  // Get all navigation menus
  getAllNavigationMenus(): Observable<any> {
    return this.http.get<{menus: any}>(`${this.apiUrl}/navigation`);
  }

  // Get news articles
  getNewsArticles(category?: string, limit?: number): Observable<any> {
    let url = `${this.apiUrl}/news`;
    const params = [];
    if (category && category !== 'all') {
      params.push(`category=${category}`);
    }
    if (limit) {
      params.push(`limit=${limit}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return this.http.get<any>(url);
  }

  // Get single news article
  getNewsArticle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/news/${id}`);
  }

  // Get platforms
  // Get platforms (Deprecated: use getAllProductDetailsData)
  getPlatforms(): Observable<any[]> {
     return this.http.get<any>(`${this.apiUrl}/product-details`).pipe(
       map(response => response.data.platforms)
     );
  }

  // Get single platform
  getPlatform(platformKey: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/platforms/${platformKey}`);
  }

  // News API methods
  getNewsContent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/news/content`);
  }

  getNewsTestimonial(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/news/testimonial`);
  }

  getNewsSocialGallery(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/news/social-gallery`);
  }

  getAllNewsData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/news/all`);
  }
  
  // New method for dynamic news page content
  getNewsPageContent(): Observable<NewsPageContent> {
    // Check cache first
    if (this.contentCache.has('news_page')) {
      return of(this.contentCache.get('news_page'));
    }
    
    return this.http.get<NewsPageContent>(`${this.apiUrl}/news/pages`).pipe(
      map(data => {
        this.contentCache.set('news_page', data);
        return data;
      }),
      catchError(error => {
        console.error('Error loading news page content:', error);
        throw error;
      })
    );
  }

  // Get home page content from the sync endpoint
  getHomePageContent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pages/home`).pipe(
      map(response => {
        return response; // Returns { success: true, data: { ... } }
      }),
      catchError(error => {
        console.error('Error loading home page content:', error);
        throw error;
      })
    );
  }

  // Get about page content from the sync endpoint
  getAboutPageContent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pages/about`).pipe(
      map(response => {
        return response; // Returns { success: true, data: { ... } }
      }),
      catchError(error => {
        console.error('Error loading about page content:', error);
        throw error;
      })
    );
  }

  // Product-details API methods
  getProductDetailsPlatforms(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product-details/platforms`);
  }

  getProductDetailsPlatform(platformKey: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product-details/${platformKey}`);
  }

  getProductDetailsAchievements(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product-details/achievements`);
  }

  getProductDetailsTargetAudience(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product-details/target-audience`);
  }

  getProductDetailsDeployment(platformKey: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product-details/deployment/${platformKey}`);
  }

  getProductDetailsCTA(platformKey: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product-details/cta/${platformKey}`);
  }

  getAllProductDetailsData(): Observable<ProductDetailsResponse> {
    return this.http.get<ProductDetailsResponse>(`${this.apiUrl}/product-details`);
  }

  // Clear cache
  clearCache(): void {
    this.contentCache.clear();
  }
  // Helper to clean up image URLs (Global Utility)
  normalizeImageUrl(url: any): string {
    if (!url) return '';
    
    // 1. Handle Array input
    if (Array.isArray(url)) {
        if (url.length > 0) {
            return this.normalizeImageUrl(url[0]);
        }
        return '';
    }

    // 2. Process string
    let cleanUrl = String(url);
    
    // 3. Keep 'http' part only (Aggressive fix for dirty strings)
    const httpIndex = cleanUrl.indexOf('http');
    if (httpIndex !== -1) {
        cleanUrl = cleanUrl.substring(httpIndex);
    }
    
    // 4. Remove garbage quotes or escaped characters
    cleanUrl = cleanUrl.replace(/&quot;/g, '')
                       .replace(/\\"/g, '"') 
                       .replace(/"/g, '')
                       .trim();

    // 5. Replace 'api.localhost' with 'localhost' (Environment Specific Fix)
    // This allows it to work in local environment where api.localhost might not resolve
    // In production, the API should return valid URLs, but this check is safe
    if (cleanUrl.includes('api.localhost')) {
        cleanUrl = cleanUrl.replace('api.localhost', 'localhost');
    }

    return cleanUrl;
  }
}
