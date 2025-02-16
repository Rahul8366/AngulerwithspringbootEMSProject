package com.example.sms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sms.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}
