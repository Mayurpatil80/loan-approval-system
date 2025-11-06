package com.LoanApp.LoanApp.controller;

import com.LoanApp.LoanApp.model.LoanApplication;
import com.LoanApp.LoanApp.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForLoan(@RequestBody LoanApplication application) {
        if (application.getApplicant() == null || application.getApplicant().getEmail() == null || application.getApplicant().getName() == null) {
            return ResponseEntity.badRequest().body("Applicant details (name and email) are required.");
        }

        // Add validation for numerical fields
        if (application.getLoanAmount() == null || application.getIncome() == null || application.getCreditScore() == null) {
            return ResponseEntity.badRequest().body("Loan amount, income, and credit score are required.");
        }

        try {
            LoanApplication processedApplication = loanService.processLoanApplication(application);

            return ResponseEntity.status(HttpStatus.CREATED).body(processedApplication);
        } catch (Exception e) {
            System.err.println("Error processing loan application: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to process application.", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public List<LoanApplication> getAllApplications() {
        return loanService.getAllApplications();
    }

    private record ErrorResponse(String message, String details) {}
}