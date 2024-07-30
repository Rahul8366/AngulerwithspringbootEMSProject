package com.example.sms;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class EmployeeManagementSystem5Application {
	
	 private static final String UPLOAD_DIR = "uploads/";

	public static void main(String[] args) {
		SpringApplication.run(EmployeeManagementSystem5Application.class, args);
	}

	@Bean
    CommandLineRunner init() {
        return (args) -> {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        };
    }
}
