import { Component, signal, OnInit } from '@angular/core';
import { JobApplication, JobApplicationService } from '../../services/job-application.service';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-application-form',
  styleUrl: './application-form.css',
  templateUrl: './application-form.html',
})



export class ApplicationForm implements OnInit {
  constructor(
    private jobApplicationService: JobApplicationService,
    private route: ActivatedRoute,
    private router: Router
  ) { };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editingId = Number(id);

      this.jobApplicationService
        .getApplicationById(this.editingId)
        .subscribe({
          next: (application) => {
            this.company.set(application.company);
            this.position.set(application.position);
            this.status.set(application.status);
            this.workMode.set(application.workMode);
            this.technologies.set(application.technologies);
            this.applicationDate.set(application.applicationDate);
            this.offerUrl.set(application.offerUrl);
            this.notes.set(application.notes);
          },
          error: (error) => {
            console.error('Error al cargar candidatura:', error);
            this.errorMessage.set('No se pudo cargar la candidatura.');
          }
        });
    }
  }

  editingId: number | null = null;
  successMessage = signal('');
  errorMessage = signal('');
  company = signal('');
  position = signal('');
  status = signal('');
  workMode = signal('');
  technologies = signal('');
  applicationDate = signal('');
  offerUrl = signal('');
  notes = signal('');

  buildApplication(): JobApplication {

    const application = {
      company: this.company(),
      position: this.position(),
      status: this.status(),
      workMode: this.workMode(),
      technologies: this.technologies(),
      applicationDate: this.applicationDate(),
      offerUrl: this.offerUrl(),
      notes: this.notes()
    };

    return application;

  }

  submitApplication(): void {

    this.successMessage.set('');
    this.errorMessage.set('');

    if (
      !this.company() ||
      !this.position() ||
      !this.status() ||
      !this.workMode() ||
      !this.applicationDate()
    ) {
      this.errorMessage.set(
        'Por favor, complete todos los campos obligatorios.'
      );
      return;
    }

    const application = this.buildApplication();


    if (this.editingId !== null) {

      this.jobApplicationService
        .updateApplication(this.editingId, application)
        .subscribe({
          next: (data) => {
            console.log('Candidatura actualizada:', data);

            this.successMessage.set(
              'Candidatura actualizada correctamente'
            );

            this.jobApplicationService.notifyApplicationsChanged();

            this.router.navigate(['/'], {
              state: { message: 'Candidatura actualizada correctamente' }
            });
          },
          error: (error) => {
            console.error(
              'Error al actualizar candidatura:',
              error
            );

            this.errorMessage.set(
              'Error al actualizar candidatura.'
            );
          }
        });

    } else {

      this.jobApplicationService
        .createApplication(application)
        .subscribe({
          next: (data) => {
            console.log('Candidatura creada:', data);

            this.successMessage.set(
              'Candidatura creada correctamente'
            );

            this.resetForm();

            this.jobApplicationService.notifyApplicationsChanged();

            this.router.navigate(['/'], {
              state: { message: 'Candidatura creada correctamente' }
            });
          },
          error: (error) => {
            console.error(
              'Error al crear candidatura:',
              error
            );

            this.errorMessage.set(
              'Error al crear candidatura.'
            );
          }
        });
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.editingId = null;
  }

  isEditing(): boolean {
    return this.editingId !== null;
  }

  resetForm(): void {
    this.company.set('');
    this.position.set('');
    this.status.set('');
    this.workMode.set('');
    this.technologies.set('');
    this.applicationDate.set('');
    this.offerUrl.set('');
    this.notes.set('');
  }
}

