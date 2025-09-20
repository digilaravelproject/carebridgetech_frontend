import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NewsPageContent } from '../pages/news/news.component';

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
  private apiUrl = 'http://localhost:5001/api';
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
  getPlatforms(): Observable<any[]> {
    return this.http.get<{platforms: any[]}>(`${this.apiUrl}/platforms`).pipe(
      map(response => response.platforms)
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

  // Product-details API methods
  getProductDetailsPlatforms(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product-details/platforms`);
  }

  getProductDetailsPlatform(platformKey: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product-details/platform/${platformKey}`);
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

  getAllProductDetailsData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product-details/all`);
  }

  // Clear cache
  clearCache(): void {
    this.contentCache.clear();
  }
}
