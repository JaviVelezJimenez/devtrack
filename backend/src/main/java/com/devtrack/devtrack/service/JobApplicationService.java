package com.devtrack.devtrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devtrack.devtrack.dto.JobApplicationRequest;
import com.devtrack.devtrack.dto.JobApplicationResponse;
import com.devtrack.devtrack.dto.JobApplicationStatsResponse;
import com.devtrack.devtrack.entity.ApplicationStatus;
import com.devtrack.devtrack.entity.JobApplication;
import com.devtrack.devtrack.exception.JobApplicationNotFoundException;
import com.devtrack.devtrack.repository.JobApplicationRepository;

@Service
public class JobApplicationService {

    

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public List<JobApplicationResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public JobApplicationResponse findById(Long id) {
        JobApplication application = findEntityById(id);

        return toResponse(application);
    }

    public JobApplicationResponse save(JobApplicationRequest request) {

        JobApplication application = new JobApplication();

        application.setCompany(request.getCompany());
        application.setPosition(request.getPosition());
        application.setStatus(request.getStatus());
        application.setWorkMode(request.getWorkMode());
        application.setTechnologies(request.getTechnologies());
        application.setApplicationDate(request.getApplicationDate());
        application.setOfferUrl(request.getOfferUrl());
        application.setNotes(request.getNotes());

        JobApplication saved = repository.save(application);

        return toResponse(saved);
    }

    public JobApplicationResponse update(
            Long id,
            JobApplicationRequest request) {

        JobApplication existing = findEntityById(id);

        existing.setCompany(request.getCompany());
        existing.setPosition(request.getPosition());
        existing.setStatus(request.getStatus());
        existing.setWorkMode(request.getWorkMode());
        existing.setTechnologies(request.getTechnologies());
        existing.setApplicationDate(request.getApplicationDate());
        existing.setOfferUrl(request.getOfferUrl());
        existing.setNotes(request.getNotes());

        JobApplication updated = repository.save(existing);

        return toResponse(updated);
    }

    public void delete(Long id) {
        JobApplication existing = findEntityById(id);
        repository.delete(existing);
    }

    private JobApplication findEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new JobApplicationNotFoundException(id));
    }

    private JobApplicationResponse toResponse(JobApplication application) {

        JobApplicationResponse response = new JobApplicationResponse();

        response.setId(application.getId());
        response.setCompany(application.getCompany());
        response.setPosition(application.getPosition());
        response.setStatus(application.getStatus());
        response.setWorkMode(application.getWorkMode());
        response.setTechnologies(application.getTechnologies());
        response.setApplicationDate(application.getApplicationDate());
        response.setOfferUrl(application.getOfferUrl());
        response.setNotes(application.getNotes());

        return response;
    }

    public List<JobApplicationResponse> findByStatus(ApplicationStatus status) {
        return repository.findByStatus(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<JobApplicationResponse> findByCompany(String company) {
        return repository.findByCompanyContainingIgnoreCase(company)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public List<JobApplicationResponse> findByStatusAndCompany(
            ApplicationStatus status,
            String company) {

        return repository
                .findByStatusAndCompanyContainingIgnoreCase(status, company)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public JobApplicationStatsResponse getStats() {

        JobApplicationStatsResponse stats =
                new JobApplicationStatsResponse();

        stats.setTotal(repository.count());
        stats.setPending(
                repository.countByStatus(ApplicationStatus.PENDING)
        );
        stats.setApplied(
                repository.countByStatus(ApplicationStatus.APPLIED)
        );
        stats.setInterview(
                repository.countByStatus(ApplicationStatus.INTERVIEW)
        );
        stats.setTechnicalTest(
                repository.countByStatus(ApplicationStatus.TECHNICAL_TEST)
        );
        stats.setOffer(
                repository.countByStatus(ApplicationStatus.OFFER)
        );
        stats.setRejected(
                repository.countByStatus(ApplicationStatus.REJECTED)
        );

        return stats;
    }
}