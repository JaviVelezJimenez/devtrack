import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface JobApplicationStats {
  total: number;
  pending: number;
  applied: number;
  interview: number;
  technicalTest: number;
  offer: number;
  rejected: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {

  applicationsChanged = signal(0);
  getApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(this.apiUrl);
  }

  private readonly apiUrl = 'http://localhost:8080/api/applications';

  constructor(private http: HttpClient) { }

  getStats(): Observable<JobApplicationStats> {
    return this.http.get<JobApplicationStats>(
      `${this.apiUrl}/stats`
    );
  }

  getFilteredApplications(
    status?: string,
    company?: string
  ): Observable<JobApplication[]> {

    const params: string[] = [];

    if (status) {
      params.push(`status=${status}`);
    }

    if (company) {
      params.push(`company=${encodeURIComponent(company)}`);
    }

    const query = params.length ? `?${params.join('&')}` : '';

    return this.http.get<JobApplication[]>(
      `${this.apiUrl}${query}`
    );
  }
  //POST
  createApplication(application: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, application);
  }

  //DELETE
  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  //PUT
  updateApplication(id: number, application: JobApplication): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.apiUrl}/${id}`, application);
  }

  //GET 
  getApplicationById(id: number): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
  }

  notifyApplicationsChanged(): void {
    this.applicationsChanged.update(value => value + 1);
  }

}

export interface JobApplication {
  id?: number;
  company: string;
  position: string;
  status: string;
  workMode: string;
  technologies: string;
  applicationDate: string;
  offerUrl: string;
  notes: string;
}

