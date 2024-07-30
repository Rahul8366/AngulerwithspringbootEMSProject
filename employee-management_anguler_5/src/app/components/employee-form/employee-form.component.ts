import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { parse, format } from 'date-fns';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      imageUrl: ['', Validators.required],
      joinedDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.employeeId = +id;
      this.employeeService.getEmployee(this.employeeId).subscribe(data => {
        // Convert date from dd/MM/yyyy to yyyy-MM-dd format
        const formattedDate = format(parse(data.joinedDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd');
        data.joinedDate = formattedDate;
        this.employeeForm.patchValue(data);
      });
    }
  }

  navigateToUpload(): void {
    this.router.navigate(['/upload']);
  }

  markAllAsTouched(): void {
    this.employeeForm.markAllAsTouched();
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      // Format joinedDate to dd/MM/yyyy before sending to the backend
      formValue.joinedDate = format(new Date(formValue.joinedDate), 'dd/MM/yyyy');

      if (this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, formValue).subscribe(() => {
          this.sendEmail(formValue); // Send email after updating
        }, error => {
          console.error('Error updating employee:', error);
        });
      } else {
        this.employeeService.createEmployee(formValue).subscribe(() => {
          this.sendEmail(formValue); // Send email after creating
        }, error => {
          console.error('Error creating employee:', error);
        });
      }
    } else {
      this.markAllAsTouched();
    }
  }

  sendEmail(formValue: any): void {
    this.employeeService.sendEmail(formValue).subscribe(response => {
      // Handle success response
      console.log('Email sent successfully:', response);
      this.router.navigate(['/employees']);
    }, error => {
      // Handle error response
      console.error('Error sending email:', error);
    });
  }
  
}
