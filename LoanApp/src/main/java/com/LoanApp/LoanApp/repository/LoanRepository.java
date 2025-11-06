package com.LoanApp.LoanApp.repository;


import com.LoanApp.LoanApp.model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanRepository extends JpaRepository<LoanApplication, Long> {
}