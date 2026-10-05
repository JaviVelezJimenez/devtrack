package com.devtrack.devtrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devtrack.devtrack.entity.ApplicationStatus;
import com.devtrack.devtrack.entity.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByStatus(ApplicationStatus status);
    List<JobApplication> findByCompanyContainingIgnoreCase(String company);
    List<JobApplication> findByStatusAndCompanyContainingIgnoreCase(
        ApplicationStatus status,
        String company
    );
    long countByStatus(ApplicationStatus status);
}
