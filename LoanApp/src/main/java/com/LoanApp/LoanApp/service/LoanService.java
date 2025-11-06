package com.LoanApp.LoanApp.service;

import com.LoanApp.LoanApp.model.LoanApplication;
import com.LoanApp.LoanApp.model.LoanStatus; // Corrected import
import com.LoanApp.LoanApp.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private EmailService emailService;

    private LoanStatus determineLoanStatus(LoanApplication application) {
        if (application.getCreditScore() == null || application.getIncome() == null || application.getLoanAmount() == null) {
            return LoanStatus.UNDER_REVIEW;
        }

        int creditScore = application.getCreditScore();
        double income = application.getIncome();
        double loanAmount = application.getLoanAmount();

        if (creditScore < 500 || income < 15000) {
            return LoanStatus.REJECTED;
        }

        if (creditScore > 700 && income > 30000 && loanAmount <= income * 15) {
            return LoanStatus.APPROVED;
        }

        return LoanStatus.UNDER_REVIEW;
    }

    @Transactional
    public LoanApplication processLoanApplication(LoanApplication application) {
        LoanStatus status = determineLoanStatus(application);
        application.setStatus(status);

        LoanApplication savedApplication = loanRepository.save(application);

        emailService.sendLoanStatusEmail(savedApplication);

        return savedApplication;
    }

    public List<LoanApplication> getAllApplications() {
        return loanRepository.findAll();
    }
}