import { Component, effect, OnInit, signal } from '@angular/core';
import {
  JobApplication,
  JobApplicationService,
  JobApplicationStats
} from '../../services/job-application.service';
import { NgClass, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [NgClass, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {

  stats = signal<JobApplicationStats | null>(null);
  applications = signal<JobApplication[]>([]);
  selectedStatus = signal('');
  companySearch = signal('');
  successMessage = signal('');
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private jobApplicationService: JobApplicationService,
    private router: Router
  ) {
    const message = history.state?.message;

    if (message) {
      this.successMessage.set(message);

      // Elimina el mensaje del historial para que no vuelva a aparecer
      const currentState = window.history.state;
      const { message: _, ...restState } = currentState;

      window.history.replaceState(
        restState,
        document.title
      );

      setTimeout(() => {
        this.successMessage.set('');
      }, 3000);
    }
    effect(() => {
      this.jobApplicationService.applicationsChanged();

      this.loadStats();
      this.loadApplications();
    });
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadApplications();
  }
  loadStats(): void {
    this.jobApplicationService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
      },
      error: (error) => {
        console.error('Error loading stats', error);
      }
    });
  }
  loadApplications(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.jobApplicationService
      .getFilteredApplications(
        this.selectedStatus() || undefined,
        this.companySearch() || undefined
      )
      .subscribe({
        next: (applications) => {
          this.applications.set(applications);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar candidaturas:', error);

          this.errorMessage.set(
            'No se pudieron cargar las candidaturas.'
          );

          this.loading.set(false);
        }
      });
  }
  clearFilters(): void {
    this.selectedStatus.set('');
    this.companySearch.set('');
    this.loadApplications();
  }
  deleteApplication(id: number): void {
    const confirmed = confirm('¿Seguro que quieres eliminar esta candidatura?');
    if (!confirmed) {
      return;
    }

    this.jobApplicationService.deleteApplication(id).subscribe({
      next: () => {
        this.jobApplicationService.notifyApplicationsChanged();
      },
      error: (error) => {
        console.error('Error deleting application', error);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'status-pending';

      case 'APPLIED':
        return 'status-applied';

      case 'INTERVIEW':
        return 'status-interview';

      case 'TECHNICAL_TEST':
        return 'status-technical';

      case 'OFFER':
        return 'status-offer';

      case 'REJECTED':
        return 'status-rejected';

      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';

      case 'APPLIED':
        return 'Solicitada';

      case 'INTERVIEW':
        return 'Entrevista';

      case 'TECHNICAL_TEST':
        return 'Prueba técnica';

      case 'OFFER':
        return 'Oferta';

      case 'REJECTED':
        return 'Rechazada';

      default:
        return status;
    }
  }

  getWorkModeLabel(workMode: string): string {
    switch (workMode) {
      case 'REMOTE':
        return 'Remoto';

      case 'ONSITE':
        return 'Presencial';

      case 'HYBRID':
        return 'Híbrido';

      default:
        return workMode;
    }
  }

}