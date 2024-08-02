package com.example.sms.service;

import com.example.sms.model.EmailRequest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendEmail(EmailRequest emailRequest) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailRequest.getEmail());
        message.setSubject("Employee Details");
        message.setText(
                "Name: " + emailRequest.getName() + "\n" +
                "Position: " + emailRequest.getPosition() + "\n" +
                "Salary: " + emailRequest.getSalary() + "\n" +
                "Image URL: " + emailRequest.getImageUrl() + "\n" +
                "Joined Date: " + emailRequest.getJoinedDate()
        );
        emailSender.send(message);
    }
}
