package com.LoanApp.LoanApp.service;


import com.LoanApp.LoanApp.model.LoanApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendLoanStatusEmail(LoanApplication application) {
        String subject = "Your Loan Application Status: " + application.getStatus().name();

        if (application.getApplicant() == null || application.getApplicant().getEmail() == null) {
            System.err.println("Error: Cannot send email. Applicant or email is missing for application ID: " + application.getId());
            return;
        }

        String body = String.format(
                "Dear %s,\n\n" +
                        "Thank you for submitting your loan application (ID: %d) for $%.2f.\n" +
                        "We have reviewed your application and the current status is: %s.\n\n" +
                        "Details:\n" +
                        " - Credit Score: %d\n" +
                        " - Annual Income: $%.2f\n" +
                        " - Requested Loan Amount: $%.2f\n\n" +
                        "If your status is 'UNDER_REVIEW', a loan officer will contact you within 2 business days.\n" +
                        "If you were REJECTED, please use the advice section on the application page to plan your next steps.\n\n" +
                        "Sincerely,\n" +
                        "The Loan Approval Team",
                application.getApplicant().getName(),
                application.getId(),
                application.getLoanAmount(),
                application.getStatus().name(),
                application.getCreditScore(),
                application.getIncome(),
                application.getLoanAmount()
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(application.getApplicant().getEmail());
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("your_email@gmail.com");

        try {
            mailSender.send(message);
            System.out.println("Email successfully sent to: " + application.getApplicant().getEmail());
        } catch (Exception e) {
            // Error handling for email failure
            System.err.println("Error sending email to " + application.getApplicant().getEmail() + ": " + e.getMessage());
        }
    }
}