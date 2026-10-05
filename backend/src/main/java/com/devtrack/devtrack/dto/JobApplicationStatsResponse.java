package com.devtrack.devtrack.dto;

public class JobApplicationStatsResponse {

    private long total;
    private long pending;
    private long applied;
    private long interview;
    private long technicalTest;
    private long offer;
    private long rejected;

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getApplied() {
        return applied;
    }

    public void setApplied(long applied) {
        this.applied = applied;
    }

    public long getInterview() {
        return interview;
    }

    public void setInterview(long interview) {
        this.interview = interview;
    }

    public long getTechnicalTest() {
        return technicalTest;
    }

    public void setTechnicalTest(long technicalTest) {
        this.technicalTest = technicalTest;
    }

    public long getOffer() {
        return offer;
    }

    public void setOffer(long offer) {
        this.offer = offer;
    }

    public long getRejected() {
        return rejected;
    }

    public void setRejected(long rejected) {
        this.rejected = rejected;
    }
}