# 💰 Automated Loan Approval System

A full-stack Java web application that automates the loan approval process using **Spring Boot**, **MySQL**, and **JavaMailSender** for email notifications.  
This system allows users to apply for loans, while administrators can review, approve, or reject applications — with automatic email notifications sent to applicants.

---

## 🚀 Features

- 🧾 **Loan Application Form:** Users can submit loan requests through a clean web interface.
- 🔍 **Automated Evaluation:** Loan approval logic evaluates applications based on criteria like income, credit score, and loan amount.
- 📧 **Email Notifications:** Automatically sends approval or rejection messages to users.
- 👩‍💼 **Admin Dashboard:** Manage and review loan applications.
- 💾 **Database Integration:** Uses MySQL to store user and loan details.
- 🌐 **Frontend:** Developed using HTML, CSS, and JavaScript.
- ⚙️ **Backend:** Built with Spring Boot and RESTful APIs.

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Java, Spring Boot |
| **Database** | MySQL |
| **Email Service** | Spring Boot Mail (JavaMailSender) |
| **Build Tool** | Maven |
| **Version Control** | Git & GitHub |

---

## 📂 Project Structure

loan-approval-system/
├── src/
│ ├── main/java/com/mayur/loanapp/
│ │ ├── controller/LoanController.java
│ │ ├── service/{LoanService.java, EmailService.java}
│ │ ├── model/{LoanApplication.java, User.java}
│ │ ├── repository/{LoanRepository.java, UserRepository.java}
│ │ └── LoanApprovalApplication.java
│ └── resources/
│ ├── application.properties
│ └── static/loan.html
├── pom.xml
└── README.md

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/loan-approval-system.git
cd loan-approval-system
2. Configure Database
Create a MySQL database named loan_db

Update your application.properties:

properties
Copy code
spring.datasource.url=jdbc:mysql://localhost:3306/loan_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=youremail@gmail.com
spring.mail.password=yourapppassword
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
3. Run the Project
bash
Copy code
mvn spring-boot:run
Then open:
👉 http://localhost:8080/loan.html

📨 Email Notifications
The system uses Spring Boot Mail to send status updates.

Make sure you enable "Less secure apps" or generate an App Password in Gmail for email sending.

🧠 Future Enhancements
Add authentication (Spring Security / JWT)

Include loan repayment tracking

Create admin analytics dashboard with charts

Deploy to cloud (AWS / Render / Railway)

👨‍💻 Author
Mayur Patil
💼 Java | Spring Boot | MySQL | Web Development
📧 yoor-email@gmail.com
🌐 GitHub Profile

